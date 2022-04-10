require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require("body-parser")
const validUrl = require('valid-url');
const mongoose = require("mongoose");
// const mySecret = process.env['TimeStampDatabase']
const Schema = mongoose.Schema;


// Basic Configuration
const port = process.env.PORT || 3000;

// connect to database
mongoose.connect(process.env.TimeStampDatabase, {
  useNewUrlParser: true, 
  useUnifiedTopology: true
})

// create mongodb schecma na model
const schemaForUrl = new Schema({
  url: String,
  short_url: Number
});

const UrlModel = mongoose.model("UrlModel", schemaForUrl)

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));


app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

// Use body-parser to Parse POST Requests
app.use(bodyParser.urlencoded({extended: false}))

app.use(bodyParser.json())

const foundValidUrls = [];

app.post("/api/shorturl", (req, res) => {
  // console.log(req.body);
  const urlProvided = req.body.url;
  // console.log("Hello World!");

  const regex = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
  
  if (!urlProvided.match(regex) || urlProvided.indexOf("https://") ==-1){
        return res.json({
        error: 'invalid url'
      });
  }else{

      const shortUrl = Math.round(Math.random() * 100);

      const urlsList = {
          original_url : urlProvided,
          short_url : shortUrl
        };

        // console.log(urlsList);

        foundValidUrls.push(urlsList);
        console.log(foundValidUrls);
        console.log(foundValidUrls.length)

        return res.json({
          original_url : urlProvided,
          short_url : shortUrl
        });

  };

});

// redirect
app.get('/api/shorturl/:id?', (req, res)=>{
  console.log(req.params.id);

  for(let i=0; i < foundValidUrls.length; i++){
    if(foundValidUrls[i]["short_url"] == req.params.id){
      console.log(req.params.id)
      console.log(foundValidUrls[i][".original_url"])
      res.redirect(foundValidUrls[i]["original_url"])
    };
  };
  
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});

// https://www.youtube.com/watch?v=Pm28JXFAu4Y&list=PLyuRouwmQCjne87u8XUdOM5oCl7vI2vVL&index=4&ab_channel=SteveGriffith-Prof3ssorSt3v3

//https://boilerplate-project-urlshortener.duncanndegwa.repl.co/?v=1637157038566
//https://boilerplate-project-urlshortener.duncanndegwa.repl.co/?v=1637157038972

// ftp:/john-doe.org
