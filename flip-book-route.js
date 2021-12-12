const flipbook = require('express').Router();
const { pdf2Html } = require('./p2h');

flipbook.post('/', async (req, res) => {
  try {
    console.log(req.files);
    pdf = req.files.pdf;
    pdf2Html(pdf.tempFilePath, pdf.name, (flipbook, prefix, pageCount) => {
      res.status(200).json({
        flipbook: flipbook,
        prefix: prefix,
        pageCount: pageCount
      });
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      error: error.message
    })
  }
})

module.exports = flipbook;
