PDF Processing Server

front end react : https://github.com/vijith6600/reactPDF.git

The project deployed using Render and netlify app : https://delightful-semolina-60e37f.netlify.app/

This project is a Node.js server designed to handle PDF files, providing functionalities for file upload, extraction of selected pages, and downloading processed PDFs. It uses the Express framework for building the server and leverages the multer library for handling file uploads, pdf-lib for PDF document manipulation, and cors for Cross-Origin Resource Sharing.

Features:

File Upload (/upload):

Allows users to upload PDF files.
Clears existing files in the 'uploads' folder.
Writes the new file to the server's 'uploads' directory.
Determines the number of pages in the uploaded PDF.
File Download (/pdf/:filename):

Enables users to download processed PDF files.
The requested PDF file is sent as a response with the appropriate content type.
PDF Extraction (/extract):

Accepts a JSON payload containing the filename of the original PDF and an array of selected page numbers.
Extracts the selected pages from the original PDF.
Creates a new PDF with only the selected pages.
Saves the new PDF and responds with the filename of the extracted PDF.
Getting Started:

Clone the repository.
Install dependencies using npm.
Start the server using nodemon index.js
