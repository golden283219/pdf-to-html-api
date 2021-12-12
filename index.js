require('dotenv').config();
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const morgan = require('morgan');
const cors = require('cors');

const app = express();

const port = process.env.PORT;
const host = process.env.HOST;

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan("dev"));
app.use('/pages', express.static(path.join(__dirname, 'flipbooks')));
app.use(fileUpload({
  tempFileDir: './pdfs/',
  useTempFiles: true
}))

app.use('/flipbook', require('./flip-book-route'));
app.listen(port, () => console.info(`server running on http://${host}:${port}`));
