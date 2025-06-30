const express = require('express');
const bodyParser = require('body-parser');
const puppeteer = require('puppeteer');

const app = express();
app.use(bodyParser.json({ limit: '5mb' }));

app.post('/pdf', async (req, res) => {
  const { html, options } = req.body;
  if (!html) return res.status(400).send('Missing HTML');

  let browser;
  try {
    browser = await puppeteer.launch({
      args: [
        '--no-sandbox', 
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu'
      ],
      headless: true,
    });
    
    const page = await browser.newPage();
    
    // Set A4 viewport dimensions (210mm × 297mm at 96dpi)
    await page.setViewport({
      width: 794,  // 210mm at 96dpi
      height: 1123, // 297mm at 96dpi
      deviceScaleFactor: 1,
    });

    // Set content and wait for fonts to load
    await page.setContent(html, { 
      waitUntil: ['networkidle0', 'domcontentloaded'] 
    });

    // Wait for fonts to be ready
    await page.evaluateHandle('document.fonts.ready');
    
    // Add additional wait for fonts to ensure they're fully loaded
    await page.waitForTimeout(1000);

    const pdfBuffer = await page.pdf({
      format: 'A4',
      width: '210mm',
      height: '297mm',
      printBackground: true,
      preferCSSPageSize: true,
      margin: {
        top: '0mm',
        bottom: '0mm',
        left: '0mm',
        right: '0mm'
      },
      ...options,
    });

    res.set('Content-Type', 'application/pdf');
    res.send(pdfBuffer);
  } catch (err) {
    console.error(err);
    res.status(500).send('PDF generation failed');
  } finally {
    if (browser) await browser.close();
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`PDF service listening on port ${PORT}`)); 