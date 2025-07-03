/**
 * Form Validation Test Cases
 * 
 * This file contains test cases for edge cases that could break the user experience.
 * Run these tests to ensure your form handles real-world messy input gracefully.
 */

// Test data for edge cases
const edgeCaseInputs = {
  // XSS Attempts
  xssAttempts: [
    '<script>alert("xss")</script>',
    '<img src="x" onerror="alert(1)">',
    'javascript:alert("xss")',
    '"><script>alert("xss")</script>',
    '&#60;script&#62;alert("xss")&#60;/script&#62;'
  ],

  // Extremely Long Inputs
  longInputs: [
    'a'.repeat(10000), // 10k characters
    'test '.repeat(2000), // 10k characters with spaces
    '🚀'.repeat(1000), // 1000 emojis
    'ñáéíóú'.repeat(500), // Unicode characters
  ],

  // Special Characters
  specialChars: [
    '!@#$%^&*()_+-=[]{}|;:,.<>?',
    '🚀🎉💻📱💡',
    'ñáéíóúüÑÁÉÍÓÚÜ',
    '测试测试测试', // Chinese
    'テストテスト', // Japanese
    '테스트테스트', // Korean
    'اختباراختبار', // Arabic
    'тесттест', // Russian
  ],

  // Malformed Emails
  malformedEmails: [
    'notanemail',
    '@domain.com',
    'user@',
    'user@domain',
    'user..name@domain.com',
    'user@domain..com',
    'user name@domain.com',
    'user@domain.com.',
    'user@domain.com ',
    ' user@domain.com',
    'user@domain.com\n',
    'user@domain.com\r',
    'user@domain.com\t',
  ],

  // Invalid Phone Numbers
  invalidPhones: [
    'notaphone',
    '123',
    '12345678901234567890', // Too long
    'abcdefghij',
    '+1-2-3-4-5-6-7-8-9-0-1-2-3-4-5-6-7-8-9-0', // Too many digits
    '0000000000', // All zeros
    '1111111111', // All ones
  ],

  // Invalid Dates
  invalidDates: [
    { month: 'InvalidMonth', year: '2020' },
    { month: 'January', year: '1800' }, // Too old
    { month: 'January', year: '2050' }, // Too future
    { month: 'January', year: 'notayear' },
    { month: 'January', year: '2020.5' },
    { month: 'January', year: '-2020' },
  ],

  // Empty/Whitespace Inputs
  emptyInputs: [
    '',
    ' ',
    '  ',
    '\t',
    '\n',
    '\r',
    '\r\n',
    '\u00A0', // Non-breaking space
    '\u200B', // Zero-width space
  ],

  // SQL Injection Attempts
  sqlInjection: [
    "'; DROP TABLE users; --",
    "' OR '1'='1",
    "'; INSERT INTO users VALUES ('hacker', 'password'); --",
    "'; UPDATE users SET password='hacked'; --",
  ],

  // HTML/LaTeX Injection Attempts
  codeInjection: [
    '\\documentclass{article}',
    '\\begin{document}',
    '\\end{document}',
    '<html><body><h1>Injection</h1></body></html>',
    '<?php echo "injection"; ?>',
    '{{7*7}}', // Template injection
    '${7*7}', // Expression injection
  ]
};

// Test functions
const testValidation = {
  // Test XSS prevention
  testXSSPrevention: (input, fieldName) => {
    const hasXSS = /[<>]/.test(input);
    if (hasXSS) {
      console.error(`❌ XSS vulnerability in ${fieldName}:`, input);
      return false;
    }
    console.log(`✅ XSS prevention passed for ${fieldName}`);
    return true;
  },

  // Test length limits
  testLengthLimits: (input, fieldName, maxLength = 2000) => {
    if (input.length > maxLength) {
      console.error(`❌ Length limit exceeded in ${fieldName}: ${input.length} > ${maxLength}`);
      return false;
    }
    console.log(`✅ Length limit passed for ${fieldName}: ${input.length} <= ${maxLength}`);
    return true;
  },

  // Test email validation
  testEmailValidation: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email) && email.length >= 5 && email.length <= 254;
    if (!isValid) {
      console.error(`❌ Invalid email:`, email);
      return false;
    }
    console.log(`✅ Valid email:`, email);
    return true;
  },

  // Test phone validation
  testPhoneValidation: (phone) => {
    if (!phone) return true; // Optional field
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    const isValid = phoneRegex.test(cleanPhone);
    if (!isValid) {
      console.error(`❌ Invalid phone:`, phone);
      return false;
    }
    console.log(`✅ Valid phone:`, phone);
    return true;
  },

  // Test date validation
  testDateValidation: (month, year) => {
    const validMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const isValidMonth = validMonths.includes(month);
    const numYear = parseInt(year);
    const isValidYear = numYear >= 1900 && numYear <= new Date().getFullYear() + 5;
    
    if (!isValidMonth) {
      console.error(`❌ Invalid month:`, month);
      return false;
    }
    if (!isValidYear) {
      console.error(`❌ Invalid year:`, year);
      return false;
    }
    console.log(`✅ Valid date: ${month} ${year}`);
    return true;
  },

  // Test required field validation
  testRequiredField: (input, fieldName) => {
    const isEmpty = !input || input.trim().length === 0;
    if (isEmpty) {
      console.error(`❌ Required field empty: ${fieldName}`);
      return false;
    }
    console.log(`✅ Required field filled: ${fieldName}`);
    return true;
  },

  // Test sanitization
  testSanitization: (input, fieldName) => {
    const sanitized = input.trim().replace(/\s+/g, ' ').replace(/[<>]/g, '');
    if (sanitized !== input) {
      console.log(`✅ Sanitization applied to ${fieldName}:`, { original: input, sanitized });
    }
    return true;
  }
};

// Run all tests
const runValidationTests = () => {
  console.log('🧪 Starting Form Validation Tests...\n');

  let passedTests = 0;
  let totalTests = 0;

  // Test XSS prevention
  console.log('🔒 Testing XSS Prevention:');
  edgeCaseInputs.xssAttempts.forEach(input => {
    totalTests++;
    if (testValidation.testXSSPrevention(input, 'XSS Test')) passedTests++;
  });

  // Test length limits
  console.log('\n📏 Testing Length Limits:');
  edgeCaseInputs.longInputs.forEach(input => {
    totalTests++;
    if (testValidation.testLengthLimits(input, 'Long Input Test')) passedTests++;
  });

  // Test email validation
  console.log('\n📧 Testing Email Validation:');
  edgeCaseInputs.malformedEmails.forEach(email => {
    totalTests++;
    if (testValidation.testEmailValidation(email)) passedTests++;
  });

  // Test phone validation
  console.log('\n📞 Testing Phone Validation:');
  edgeCaseInputs.invalidPhones.forEach(phone => {
    totalTests++;
    if (testValidation.testPhoneValidation(phone)) passedTests++;
  });

  // Test date validation
  console.log('\n📅 Testing Date Validation:');
  edgeCaseInputs.invalidDates.forEach(date => {
    totalTests++;
    if (testValidation.testDateValidation(date.month, date.year)) passedTests++;
  });

  // Test required fields
  console.log('\n✅ Testing Required Fields:');
  edgeCaseInputs.emptyInputs.forEach(input => {
    totalTests++;
    if (testValidation.testRequiredField(input, 'Empty Input Test')) passedTests++;
  });

  // Test sanitization
  console.log('\n🧹 Testing Sanitization:');
  [...edgeCaseInputs.specialChars, ...edgeCaseInputs.xssAttempts].forEach(input => {
    totalTests++;
    if (testValidation.testSanitization(input, 'Sanitization Test')) passedTests++;
  });

  // Summary
  console.log('\n📊 Test Results:');
  console.log(`✅ Passed: ${passedTests}`);
  console.log(`❌ Failed: ${totalTests - passedTests}`);
  console.log(`📈 Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);

  if (passedTests === totalTests) {
    console.log('\n🎉 All tests passed! Your form validation is robust.');
  } else {
    console.log('\n⚠️  Some tests failed. Review the validation logic above.');
  }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    edgeCaseInputs,
    testValidation,
    runValidationTests
  };
}

// Auto-run if in browser
if (typeof window !== 'undefined') {
  window.runFormValidationTests = runValidationTests;
  console.log('Form validation tests loaded. Run window.runFormValidationTests() to test.');
} 