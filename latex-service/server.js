const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const temp = require('temp');

// Automatically track and cleanup files at exit
temp.track();

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.text({ limit: '5mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'latex-compiler', timestamp: new Date().toISOString() });
});

// LaTeX compilation endpoint
app.post('/compile', async (req, res) => {
  const { latex, options = {} } = req.body;
  
  if (!latex) {
    return res.status(400).json({ error: 'LaTeX content is required' });
  }

  const {
    engine = 'pdflatex',
    passes = 2,
    timeout = 30000
  } = options;

  // Create temporary directory
  const tempDir = temp.mkdirSync('latex-compile');
  const texFile = path.join(tempDir, 'document.tex');
  const pdfFile = path.join(tempDir, 'document.pdf');
  const logFile = path.join(tempDir, 'document.log');

  try {
    // Write LaTeX content to file
    fs.writeFileSync(texFile, latex, 'utf8');

    // Compile LaTeX document
    for (let pass = 0; pass < passes; pass++) {
      const success = await runLatexCommand(engine, texFile, tempDir, timeout);
      if (!success && pass === passes - 1) {
        const log = fs.existsSync(logFile) ? fs.readFileSync(logFile, 'utf8') : '';
        return res.status(500).json({
          error: 'LaTeX compilation failed',
          log: log
        });
      }
    }

    // Check if PDF was generated
    if (!fs.existsSync(pdfFile)) {
      const log = fs.existsSync(logFile) ? fs.readFileSync(logFile, 'utf8') : '';
      return res.status(500).json({
        error: 'PDF generation failed - no output file',
        log: log
      });
    }

    // Send PDF file
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename="document.pdf"'
    });
    
    const pdfBuffer = fs.readFileSync(pdfFile);
    res.send(pdfBuffer);

  } catch (error) {
    console.error('LaTeX compilation error:', error);
    res.status(500).json({
      error: 'LaTeX compilation failed',
      details: error.message
    });
  }
});

// Template-based compilation endpoint
app.post('/compile-template', async (req, res) => {
  const { templateName, userData, options = {} } = req.body;
  
  if (!templateName || !userData) {
    return res.status(400).json({ 
      error: 'Template name and user data are required' 
    });
  }

  try {
    // Load template
    const templatePath = path.join(__dirname, 'templates', `${templateName}.tex`);
    if (!fs.existsSync(templatePath)) {
      return res.status(404).json({ 
        error: `Template not found: ${templateName}` 
      });
    }

    let templateContent = fs.readFileSync(templatePath, 'utf8');
    
    // Simple variable replacement
    templateContent = templateContent.replace(/\{\{([^}]+)\}\}/g, (match, key) => {
      const value = getNestedValue(userData, key);
      return escapeLatex(value) || '';
    });

    // Forward to compilation endpoint
    const response = await fetch(`http://localhost:${PORT}/compile`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ latex: templateContent, options })
    });

    if (response.ok) {
      const pdfBuffer = await response.buffer();
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline; filename="resume.pdf"'
      });
      res.send(pdfBuffer);
    } else {
      const error = await response.json();
      res.status(response.status).json(error);
    }

  } catch (error) {
    console.error('Template compilation error:', error);
    res.status(500).json({
      error: 'Template compilation failed',
      details: error.message
    });
  }
});

// List available templates
app.get('/templates', (req, res) => {
  try {
    const templatesDir = path.join(__dirname, 'templates');
    if (!fs.existsSync(templatesDir)) {
      return res.json({ templates: [] });
    }

    const templates = fs.readdirSync(templatesDir)
      .filter(file => file.endsWith('.tex'))
      .map(file => path.basename(file, '.tex'));

    res.json({ templates });
  } catch (error) {
    res.status(500).json({ error: 'Failed to list templates' });
  }
});

// Helper functions
function runLatexCommand(engine, texFile, workingDir, timeout) {
  return new Promise((resolve) => {
    const args = [
      '-interaction=nonstopmode',
      '-output-directory=' + workingDir,
      texFile
    ];

    const process = spawn(engine, args, {
      cwd: workingDir,
      stdio: ['pipe', 'pipe', 'pipe']
    });

    const timer = setTimeout(() => {
      process.kill();
      resolve(false);
    }, timeout);

    process.on('close', (code) => {
      clearTimeout(timer);
      resolve(code === 0);
    });

    process.on('error', () => {
      clearTimeout(timer);
      resolve(false);
    });
  });
}

function getNestedValue(obj, path) {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

function escapeLatex(text) {
  if (!text) return '';
  return text
    .replace(/\\/g, '\\textbackslash{}')
    .replace(/\{/g, '\\{')
    .replace(/\}/g, '\\}')
    .replace(/\$/g, '\\$')
    .replace(/&/g, '\\&')
    .replace(/%/g, '\\%')
    .replace(/#/g, '\\#')
    .replace(/\^/g, '\\textasciicircum{}')
    .replace(/_/g, '\\_')
    .replace(/~/g, '\\textasciitilde{}');
}

// Start server
app.listen(PORT, () => {
  console.log(`LaTeX Compiler Service running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});

module.exports = app; 