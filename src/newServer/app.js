var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const { v4: uuidv4 } = require('uuid');
const cors = require("cors")
const {writeFileSync} = require('fs')

var app = express();

app.use(logger('dev'));
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({ extended: false , limit: '50mb'}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// app.use(express.static('./public'));
app.use(cors())

app.post('/upload1',(req, res) => {

    console.log("Request on res /upload1")
  
      // Create new Filename
      let filename = `${uuidv4()}.jpg`;
  
      console.log(`Created File with name: ${filename}`)
  
      // Export file from body request
      let image = req.body.data;
  
      console.log(`Received Image: `)
  
      // Set up variables for error handling
      let buffer; 
      let e = undefined
  
      // Try to write file to webserver
    //   try{
  
        buffer = Buffer.from(image, 'base64')
        writeFileSync(`public/uploads/${filename}`, buffer)
  
    //   }catch(err){
    //     if(err) e = err;
    //   }
  
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

module.exports = app;
