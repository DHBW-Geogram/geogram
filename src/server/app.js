const express = require('express');
const multer = require('multer');
const ejs = require('ejs');
const path = require('path');
const cors = require('cors');
const {writeFileSync} = require('fs')
const { v4: uuidv4 } = require('uuid');

// Set The Storage Engine
const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: function(req, file, cb){
    cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Init Upload
const upload = multer({
  storage: storage,
  limits:{fileSize: 1000000},
  // fileFilter: function(req, file, cb){
  //   checkFileType(file, cb);
  // }
}).single('myImage');

// // Check File Type
// function checkFileType(file, cb){
//   // Allowed ext
//   const filetypes = /jpeg|jpg|png|gif/;
//   // Check ext
//   const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
//   // Check mime
//   const mimetype = filetypes.test(file.mimetype);

//   if(mimetype && extname){
//     return cb(null,true);
//   } else {
//     cb('Error: Images Only!');
//   }
// }

// Init app
const app = express();

app.use(cors())

// EJS
app.set('view engine', 'ejs');

// Public Folder
app.use(express.static('./public'));

// app.get('/', (req, res) => res.render('index'));

// app.post('/upload', (req, res) => {
//   upload(req, res, (err) => {
//     if(err){
//       res.render('index', {
//         msg: err
//       });
//     } else {
//       if(req.file == undefined){
//         res.render('index', {
//           msg: 'Error: No File Selected!'
//         });
//       } else {
//         res.render('index', {
//           msg: 'File Uploaded!',
//           file: `uploads/${req.file.filename}`
//         });
//       }
//     }
//   });
// });

app.post('/upload1', cors() ,(req, res) => {

  console.log("Request on res /upload1")

  upload(req, res, (err) => {

    // Create new Filename
    let filename = `${uuidv4()}.jpg`;

    console.log(`Created File with name: ${filename}`)

    // Export file from body request
    let image = req.body.myImage;

    console.log(`Received Image: ${image}`)

    // Set up variables for error handling
    let buffer; 
    let e = undefined

    // Try to write file to webserver
    try{

      buffer = Buffer.from(image, 'base64')
      writeFileSync(`public/uploads/${filename}`, buffer)

    }catch(err){
      if(err) e = err;
    }

    // Give App Feedback
    if(e){
      console.log(`Saving image failed:!!`)
      res.json({file: undefined})
    }else{
      console.log(`Saved image at: /uploads/${filename}`)
      res.json({
        file: `uploads/${filename}`
      });
    }

  });
});

const port = 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));