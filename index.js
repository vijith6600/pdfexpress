const express = require('express');
const multer = require('multer');
const { PDFDocument } = require('pdf-lib');
const fs = require('fs').promises;
const cors = require('cors');

const app = express();
const port = process.env.port || 3001;

app.use(cors());

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const fileBuffer = req.file.buffer;
    const filename = `${Date.now()}.pdf`;
    const uploadFolderPath = './uploads/';

    // Clear the existing files in the upload folder
    await clearUploadFolder(uploadFolderPath);

    // Write the new file to the server's 'uploads' directory
    await fs.writeFile(`${uploadFolderPath}${filename}`, fileBuffer);

    // Determine the number of pages in the uploaded PDF (you may adjust this based on your server's logic)
    const pdfDoc = await PDFDocument.load(fileBuffer);
    const numPages = pdfDoc.getPageCount();

    res.json({ filename, numPages });
  } catch (err) {
    console.error('File upload error:', err.message);
    res.status(500).send('Internal Server Error');
  }
});

// Function to clear the contents of the upload folder
const clearUploadFolder = async (folderPath) => {
  const files = await fs.readdir(folderPath);

  for (const file of files) {
    const filePath = `${folderPath}${file}`;
    await fs.unlink(filePath); // Delete each file in the folder
  }
};



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
