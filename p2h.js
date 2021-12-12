const { exec } = require('child_process');
const { mkdir, readFile, writeFile, unlink } = require('fs');
const cheerio = require('cheerio');
const pdf = require('pdfjs-dist/es5/build/pdf.js');
const path = require('path');

exports.pdf2Html = async (tempFilePath, fileName, cb) => {
  const outputName = path.basename(fileName, path.extname(fileName)).replace(' ', '-');
  const html_file = `${outputName}.html`;
  const flipbook = `${new Date().valueOf()}-${outputName}`;
  const flipbookDir = `flipbooks/${flipbook}`;
  const outputPath = `${flipbookDir}/${outputName}.html`;

  pdf.getDocument(tempFilePath).promise.then((doc) => {
    const pageCount = doc.numPages;
    mkdir(`./flipbooks/${flipbook}`, async () => {
      console.log(`converting ${fileName} : ${tempFilePath} ===> ${outputPath}`);
      const command = `pdf2htmlEX.exe  --dest-dir ${flipbookDir} --split-pages 1 --page-filename ${html_file} \"${tempFilePath}\" \"${html_file}\"`;
      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.log(`error: ${error.message}`);
        }
        // if (stderr) {
        //   console.log(`stderr: ${stderr}`);
        //   return;
        // }
        cb(flipbook, outputName, pageCount);
        this.processHtmlFiles(flipbookDir, outputName, pageCount);
      })
    });
  }).catch(err => {console.error(err)});
}

exports.processHtmlFiles = async function (flipbook, prefix, pageCount) {
  let mainHtmlFile = `${flipbook}/${prefix}.html`;

  readFile(mainHtmlFile, (err, data) => {
    if (err) throw new Error(`main html file not found: ${mainHtmlFile}`);
    else {
      var $ = cheerio.load(data.toString());
      $('script').remove();
      $('#sidebar').remove();
      $('.loading-indicator').remove();
    }
    for (let i = 1; i <=  pageCount; i++) {
      const filePath = `${flipbook}/${prefix}${i}.html`;
      readFile(filePath, (err, data) => {
        if (err) {
          console.error(err);
          return;
        }
        const htmlContent = data.toString();
        $('#page-container').html(htmlContent);
        const outputContent = $.html();
        writeFile(`${flipbook}/${prefix}${i}.html`, outputContent, () => { });
      });
    }
    unlink(mainHtmlFile, () => {});
  })
}

