var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const fs = require('fs');
const cors = require('cors');
const mime = require('mime-types');
const pathSys = require('path');
const { parse } = require('path');


require('dotenv').config()


process.env.PORT = 3008;
process.setMaxListeners(0);

var app = express();
app.use(cors());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.send('No Document Found')
})
app.post('/', (req, res) => {
  res.send("No Document Found!");
})

const loadFile = (req, res, next, path)=>{
  const file = req.params.file;
  const fileSplit = file.split('.');
  const fileExtension = fileSplit.pop();
  const folder = fileSplit.join('.')
  const fileName = req.query.format?req.query.format:'original';
  let fileFullPath = path+"/"+folder+"/"+fileName+"."+fileExtension;

  if(!fs.existsSync(fileFullPath)){
    const path = process.env.temp_path+"/"+folder+"/"+fileName+"."+fileExtension;;
    fileFullPath = path;
  }

  fs.stat(fileFullPath, (err, status)=> {
    if(err) {
      res.status(404).json({
        "nonce": new Date().getTime(),
        "status" : "file_not_found"});
    } else {
      let mimeType = mime.contentType(pathSys.extname(fileFullPath));
      if(mimeType === false) {
        mimeType = "application/octet-stream";
      }
      const limit = 2;
      const fsTotal = status.size;
      let fsStart = 0;
      let fsEnd = fsTotal-1;
      let chunksize = (fsEnd - fsStart) + 1;

      if (req.headers.range) {
        const ranges = req.headers.range.replace(/bytes=/, "").split("-");
        console.log(ranges);
        const range = req.headers.range;
        const parts = range.replace(/bytes=/, "").split("-");
        const partialstart = parts[0];
        const partialend = parts[1];
        fsStart = parseInt(partialstart, 10);
        fsEnd = partialend ? parseInt(partialend, 10) : fsTotal-1;
        chunksize = (fsEnd - fsStart) + 1;
      }
      console.log(`${fsStart}-${fsTotal-1}/${fsTotal}`);
      try {
        if(fsStart>0) {
          res.status(206);
        }
        res.set('Connection', 'keep-alive');
        res.set("Content-Range",`bytes ${fsStart}-${fsEnd}/${fsTotal}`);
        res.set("Accept-Ranges", "bytes");
        res.set("Content-Length", `${chunksize}`);
        res.set("Content-Type", `${mimeType}`);
        const readStream = fs.createReadStream(fileFullPath, {start: fsStart, end: fsEnd});
        readStream.pipe(res);

      } catch (error) {
        res.end();
      }
    }
  });
}
app.get('/temp/:file', (req, res, next) => {
  const path = process.env.temp_path;
  loadFile(req, res, next, path)
});
app.get('/:file', (req, res, next) => {
  const path = process.env.file_path;
  loadFile(req, res, next, path)
});



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  console.log('err',err)
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send('Error!')
});




/**
 * Listen on provided port, on all network interfaces.
 */

app.listen(process.env.PORT, () => {
  console.log(`Example app listening at http://localhost:${process.env.PORT}`)
})
