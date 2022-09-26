require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const shortid = require('shortid');


//import Schema from Mongoose
const { Schema } = mongoose;

const databaseConnect = process.env.MONGO_URI;

//Mount body-parser on Middleware
app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());

// Basic Configuration
const port = process.env.PORT || 3001;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});


// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

//build Schema and Model to save URLs

const linkSchema = new Schema({
    original_link : String,
    short_url : String,
    suffix : String
})

//create a model using the linkSchema
const Saved_url = mongoose.model('Saved_url',linkSchema);

//API Endpoint for Posting the Links
app.post('/api/shorturl',((req,res) => {

  let clientRequestedURL = req.body.url
  let suffix = shortid.generate();
  let new_short_url = suffix;

    let new_url = new Saved_url({
      original_link : clientRequestedURL,
      short_url : __dirname + "/api/shorturl/" + suffix,
      suffix : suffix
    })

    new_url.save((err,data) => {
    if(err) console.log(err);

    res.json({
      "original_url" : new_url.original_link,
      "short_url" : new_url.short_url,
      "suffix" : suffix,
      "saved" : true
    })

//  console.log("You have saved The Document !");
  })

}));

//API Endpoint for Redirecting the Links
app.get('/api/shorturl/:suffix', ((req,res) => {
  let userGeneratedSuffix = req.params.suffix;
  // console.log(userGeneratedSuffix);

 Saved_url.find({ suffix : userGeneratedSuffix}).then((foundUrl) => {
   let redirectUrl = foundUrl[0];
  // console.log(redirectUrl , "<= send us back here");
   res.redirect(redirectUrl.original_link);
 })
}))


app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});

 //mongoose.connect('mongodb://localhost:27017/myapp')

mongoose.connect(databaseConnect);
