// server.js
const express = require('express');
const multer = require('multer');
const { PDFDocument } = require('pdf-lib');
const fs = require('fs').promises;
const cors = require('cors');

const app = express();
const port = 3001;


app.use(cors());

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const fileBuffer = req.file.buffer;
    const filename = `${Date.now()}.pdf`;

    await fs.writeFile(`./uploads/${filename}`, fileBuffer);
    
    res.json({ filename });
  } catch (err) {
    console.error('File upload error:', err.message);
    res.status(500).send('Internal Server Error');
  }
});





app.get('/pdf/:filename', (req, res) => {
  const { filename } = req.params;
  res.sendFile(`${__dirname}/uploads/${filename}`, { headers: { 'Content-Type': 'application/pdf' } });
});



app.post('/extract', express.json(), async (req, res) => {
  try {
    const { filename, selectedPages } = req.body;
    const filePath = `./uploads/${filename}`;
    const fileBuffer = await fs.readFile(filePath);
    const pdfDoc = await PDFDocument.load(fileBuffer);
    
    const newPdfDoc = await PDFDocument.create();
    for (const pageNum of selectedPages) {
      const [copiedPage] = await newPdfDoc.copyPages(pdfDoc, [pageNum - 1]);
      newPdfDoc.addPage(copiedPage);
    }

    const newFilename = `${Date.now()}_extracted.pdf`;
    const newPdfBytes = await newPdfDoc.save();
    await fs.writeFile(`./uploads/${newFilename}`, newPdfBytes);

    res.json({ filename: newFilename });
  } catch (err) {
    console.error('PDF extraction error:', err.message);
    res.status(500).send('Internal Server Error');
  }
});



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
