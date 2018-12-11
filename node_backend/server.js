var express = require('express');
var cors = require('cors');
var app = express();
var bodyParser = require('body-parser');
var admin = require("firebase-admin");
var serviceAccount = require('./privateKey.json');

var posts = [];

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://nihproject-1a5b4.firebaseio.com"
});

const db = admin.database();

function doCreateTimeStamp(Unixtime,Mid, date,timeOfDay) {
  db.ref(`users/${Mid}/stamps/${Unixtime}`).set({
    date,
    timeOfDay
  });
}

app.use(cors({
  origin: 'http://www.localhost:3000'
}));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.use(function(req,res,next){
  var myURL = req.protocol +"://"+req.get('host')+req.originalUrl;
  var PostObject = {
    'URL':myURL,
    'RequestBody':JSON.stringify(req.body),
    'Time': new Date().toLocaleString()
  };
  posts.push(PostObject);
  console.log("Received a request with URL: "+myURL);
  console.log("body is : "+JSON.stringify(req.body));
  next();
});

app.use(function(req, res, next) {
   res.header("Access-Control-Allow-Origin", "*");
   res.header("Access-Control-Allow-Headers", 
   "Origin, X-Requested-With, Content-Type, Accept"); 
   next(); 
  });

app.get('/clear',(req,res)=>{
  posts = [];
  res.status(200).send("array cleared");
});

app.get('/', (req, res) => {
  res.header("Access-Control-Allow-Origin: *");
  var html = "<ul>";
  posts.forEach(function (arrayItem) {
    html = html + "<li>";
    html = html + "URL: "+arrayItem.URL + "<br/>RequestBody: "+ arrayItem.RequestBody + "<br/>Time: "+ arrayItem.Time;
    html = html + "</li><br>";
  });
  html = html + "</ul>";
  res.status(200).send(html);
});

/*
URL: http://34.214.27.97/test
RequestBody: {"unix timestamp":"1544052040","readable timestamp":"Wed Dec 5 23:20:40 2018\n","device id":"24:0A:C4:08:4A:E4","request type":"happy"}
Time: 2018-12-5 23:20:40
*/
app.post('/capture',(req,res)=>{
  res.header("Access-Control-Allow-Origin: *");
  console.log("body is : "+JSON.stringify(req.body));
  console.log('Unix Time Stamp is '+JSON.stringify(req.body.unix_timestamp));
  var time = req.body.unix_timestamp;
  var date = new Date(time*1000);
  var hours = date.getHours();
  // Minutes part from the timestamp
  var minutes = "0" + date.getMinutes();
  // Seconds part from the timestamp
  var seconds = "0" + date.getSeconds();

  // Will display time in 10:30:23 format
  var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
  console.log('time is ',formattedTime);
  console.log(date.toISOString().slice(0,10));
  var reqDate = date.toISOString().slice(0,10);
  var id = req.body.device_id;
  console.log('id is ',id);
  doCreateTimeStamp(time,id,reqDate,formattedTime);
  res.status(200).send("Date Posted");
});

app.listen(8080, () => console.log('Backend API listening on port 8080!'))