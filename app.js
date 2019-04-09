const express = require('express')
const bodyParser= require('body-parser')
const multer = require('multer');
const path = require('path');
const excel = require('exceljs');
const app = express();
const workbook = new excel.Workbook();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/',function(req,res){
    res.sendFile(__dirname + '/index.html');
});

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
      cb(null,file.originalname) 
    }
});
const upload = multer({ storage: storage });
var fs = require('fs');
var http = require('http');
app.post('/uploadfile', upload.single('myFile'), (req, res, next) => {
    const file = req.file
    if (!file) {
      let error = {};
      error.message = "Please upload a file.";
      error.httpStatusCode = 400
      return res.status(400).send(error);
    }
    if(file.filename.indexOf('xlsx') > 0) {
      workbook.xlsx.readFile(file.path)
        .then(function() {
          console.log('1');
          workbook.eachSheet(function(worksheet, sheetId) {
            let row = worksheet.getRow(1);
            row.getCell('A').value = row.getCell('A').value.replace(/(\r\n|\n|\r)/gm, "");
            row.getCell('B').value = row.getCell('B').value.replace(/(\r\n|\n|\r)/gm, "");
            row.getCell('C').value = row.getCell('C').value.replace(/(\r\n|\n|\r)/gm, "");
            row.getCell('D').value = row.getCell('D').value.replace(/(\r\n|\n|\r)/gm, "");
            row.commit();
            console.log('2');
            workbook.xlsx.writeFile(file.path)
            .then(function() {
              return res.status(200).send(file);
              // return res.redirect('/download?path='+file.path);
            });
          });
          console.log('3');
          // let file1 = __dirname +'\\'+ file.path;
          // console.log('file1',file1);
          // return res.download(file1); 
         
          // return res.status(200).send(file);
          // res.redirect('/download?path='+file.path);
          // var file1 = fs.createWriteStream('/uploads/file.xlsx');
          // var request = http.get(file.path, function(response) {
          //   response.pipe(file1);
          //   file1.on('finish', function() {
          //     file1.close(cb);  // close() is async, call cb after close completes.
          //   });
          // }).on('error', function(err) { // Handle errors
          //   fs.unlink(dest); // Delete the file async. (But we don't check the result)
          //   if (cb) cb(err.message);
          // });
        });
    } else {
      res.status(200).send({'message':'File not supported'});
    }
});

app.get('/download', function(req, res) {
  let pathName = req.query.path;
  let file = __dirname +'\\'+ pathName;
  console.log('file',file);
  return res.download(file); 
});

app.listen(3000, () => console.log('Server started on port 3000'));