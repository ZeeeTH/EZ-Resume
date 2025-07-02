#!/usr/bin/env node
/**
 * Security Headers Testing Script for EZ-Resume
 * 
 * This script tests that all security headers are properly configured.
 * Run with: node scripts/test-security.js [url]
 * 
 * Example:
 * - Development: node scripts/test-security.js http://localhost:3000
 * - Production: node scripts/test-security.js https://ez-resume.xyz
 */

const https = require('https');
const http = require('http');
const { URL } = require('url');

// Expected security headers and their validation functions
const expectedHeaders = {
  'x-frame-options': {
    expected: 'DENY',
    description: 'Prevents clickjacking attacks',
    critical: true
  },
  'x-content-type-options': {
    expected: 'nosniff',
    description: 'Prevents MIME type sniffing',
    critical: true
  },
  'referrer-policy': {
    expected: 'origin-when-cross-origin',
    description: 'Controls referrer information',
    critical: false
  },
  'x-xss-protection': {
    expected: '1; mode=block',
    description: 'Enables XSS protection',
    critical: true
  },
  'strict-transport-security': {
    expected: /max-age=\d+/,
    description: 'Forces HTTPS connections',
    critical: true,
    productionOnly: true
  },
  'content-security-policy': {
    expected: /default-src 'self'/,
    description: 'Controls resource loading',
    critical: true
  },
  'permissions-policy': {
    expected: /camera=\(\)/,
    description: 'Controls browser features',
    critical: false
  }
};

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const client = parsedUrl.protocol === 'https:' ? https : http;
    
    const req = client.request(url, { method: 'HEAD' }, (res) => {
      resolve({
        statusCode: res.statusCode,
        headers: res.headers
      });
    });
    
    req.on('error', reject);
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
    
    req.end();
  });
}

function validateHeader(name, value, expected, isProduction) {
  if (typeof expected === 'string') {
    return value === expected;
  } else if (expected instanceof RegExp) {
    return expected.test(value);
  }
  return false;
}

function formatResult(passed, message) {
  const icon = passed ? '✅' : '❌';
  const color = passed ? colors.green : colors.red;
  return `${color}${icon} ${message}${colors.reset}`;
}

async function testSecurityHeaders(baseUrl) {
  console.log(`${colors.bold}🔒 Security Headers Test for EZ-Resume${colors.reset}`);
  console.log(`${colors.blue}Testing URL: ${baseUrl}${colors.reset}\n`);
  
  const isProduction = baseUrl.startsWith('https://');
  let totalTests = 0;
  let passedTests = 0;
  let criticalFailures = 0;
  
  try {
    // Test main page
    console.log(`${colors.bold}📄 Testing Main Page${colors.reset}`);
    const mainResponse = await makeRequest(baseUrl);
    
    if (mainResponse.statusCode !== 200) {
      console.log(formatResult(false, `Main page returned status ${mainResponse.statusCode}`));
      return;
    }
    
    // Check each expected header
    for (const [headerName, config] of Object.entries(expectedHeaders)) {
      totalTests++;
      
      // Skip production-only headers in development
      if (config.productionOnly && !isProduction) {
        console.log(`${colors.yellow}⏭️  Skipping ${headerName} (production only)${colors.reset}`);
        continue;
      }
      
      const headerValue = mainResponse.headers[headerName.toLowerCase()];
      
      if (!headerValue) {
        const result = formatResult(false, `${headerName}: Missing`);
        console.log(`${result} - ${config.description}`);
        if (config.critical) criticalFailures++;
        continue;
      }
      
      const isValid = validateHeader(headerName, headerValue, config.expected, isProduction);
      
      if (isValid) {
        passedTests++;
        console.log(formatResult(true, `${headerName}: ${headerValue}`));
      } else {
        const result = formatResult(false, `${headerName}: ${headerValue} (invalid)`);
        console.log(`${result} - ${config.description}`);
        if (config.critical) criticalFailures++;
      }
    }
    
    // Test API endpoint
    console.log(`\n${colors.bold}🔌 Testing API Endpoint${colors.reset}`);
    try {
      const apiResponse = await makeRequest(`${baseUrl}/api/test`);
      
      // Check CORS headers
      const corsHeaders = ['access-control-allow-origin', 'access-control-allow-methods'];
      for (const header of corsHeaders) {
        totalTests++;
        const value = apiResponse.headers[header];
        if (value) {
          passedTests++;
          console.log(formatResult(true, `${header}: ${value}`));
        } else {
          console.log(formatResult(false, `${header}: Missing`));
        }
      }
    } catch (error) {
      console.log(`${colors.yellow}⚠️  API endpoint test failed: ${error.message}${colors.reset}`);
    }
    
    // Test Content Security Policy in detail
    console.log(`\n${colors.bold}🛡️  Content Security Policy Analysis${colors.reset}`);
    const csp = mainResponse.headers['content-security-policy'];
    if (csp) {
      const directives = csp.split(';').map(d => d.trim());
      const requiredDirectives = [
        'default-src',
        'script-src',
        'style-src',
        'connect-src',
        'frame-src'
      ];
      
      for (const directive of requiredDirectives) {
        const found = directives.some(d => d.startsWith(directive));
        console.log(formatResult(found, `${directive}: ${found ? 'Present' : 'Missing'}`));
      }
    }
    
    // Summary
    console.log(`\n${colors.bold}📊 Test Summary${colors.reset}`);
    console.log(`Total tests: ${totalTests}`);
    console.log(`Passed: ${colors.green}${passedTests}${colors.reset}`);
    console.log(`Failed: ${colors.red}${totalTests - passedTests}${colors.reset}`);
    console.log(`Critical failures: ${colors.red}${criticalFailures}${colors.reset}`);
    
    if (criticalFailures === 0) {
      console.log(`\n${colors.green}${colors.bold}🎉 All critical security headers are properly configured!${colors.reset}`);
    } else {
      console.log(`\n${colors.red}${colors.bold}⚠️  ${criticalFailures} critical security issues found!${colors.reset}`);
      console.log(`${colors.yellow}Please fix critical issues before deploying to production.${colors.reset}`);
    }
    
    // Additional recommendations
    console.log(`\n${colors.bold}💡 Recommendations${colors.reset}`);
    console.log('- Test with browser dev tools to verify CSP is working');
    console.log('- Use online tools like securityheaders.com for additional validation');
    console.log('- Monitor for CSP violations in production logs');
    console.log('- Regularly update security headers as your app evolves');
    
  } catch (error) {
    console.error(`${colors.red}❌ Test failed: ${error.message}${colors.reset}`);
    process.exit(1);
  }
}

// Run the test
const url = process.argv[2] || 'http://localhost:3000';
testSecurityHeaders(url).catch(console.error); 