// pages/api/uploadImage.js

import multer from 'multer';
import nextConnect from 'next-connect';

const upload = multer({ dest: 'uploads/' });

const handler = nextConnect({
  onError(error, req, res) {
    res.status(500).end(`Something went wrong: ${error.message}`);
  },
  onNoMatch(req, res) {
    res.status(405).end(`Method ${req.method} Not Allowed`);
  },
});

handler.use(upload.single('file')).post((req, res) => {
  // File has been uploaded to `uploads/` directory
  // You can now handle file processing, save the file URL to your database, etc.
  res.status(200).json({ message: 'File uploaded successfully', file: req.file });
});

export default handler;
