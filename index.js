require('dotenv').config()
const express = require('express');
const cors = require("cors");
const logger = require('morgan')

const app = express();
app.use(logger('dev'))
app.use(cors());
global.multerUploader = require('./config/multer_manager')

const PORT = '5000' || process.env.PORT;

app.use('/', require('./router/files'))

app.use((err, req, res, next) => {
  if (err.code === "INCORRECT_FILETYPE") {
    res.status(422).json({ error: 'Only images are allowed' });
    return;
  }
  if (err.code === "LIMIT_FILE_SIZE") {
    res.status(422).json({ error: 'Allow file size is 500KB' });
    return;
  }
});

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));