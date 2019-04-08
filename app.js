// call all the required packages
const express = require('express')
const bodyParser= require('body-parser')
const multer = require('multer');
var path = require('path');
const app = express();
app.use(bodyParser.urlencoded({extended: true}))

//ROUTES WILL GO HERE
app.get('/',function(req,res){
    res.sendFile(__dirname + '/index.html');
   
});
// SET STORAGE
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname)) //Appending extension
    }
});
  
var upload = multer({ storage: storage });
// var upload = multer({ dest: 'uploads/' })
app.post('/uploadfile', upload.single('myFile'), (req, res, next) => {
    const file = req.file
    if (!file) {
      const error = new Error('Please upload a file')
      error.httpStatusCode = 400
      return next(error)
    }

    res.send(file)
  });
app.listen(3000, () => console.log('Server started on port 3000'));