var express = require('express');
var cors = require('cors');
var app = express();
var bodyParser = require('body-parser');
import { db } from './firebase';
var Schedule = require('./Schedule');
var Twilio = require('./messenger');
var moment = require('moment-timezone');
var posts = [];
var mySchedule = null;

app.use(cors());
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

app.get('/startMessageSystem',(req,res)=>{
  res.header("Access-Control-Allow-Origin: *");
  console.log("body is : "+JSON.stringify(req.body));
  if(mySchedule == null){
    mySchedule = new Schedule();
    mySchedule.startSystem();
    console.log("Message System Started");
    res.status(200).send("Message System Started");
  }
  else{
    console.log("System already running");
    res.status(400).send("Message system already running");
  }
  
});

app.get('/stopMessageSystem',(req,res)=>{
  res.header("Access-Control-Allow-Origin: *");
  console.log("body is : "+JSON.stringify(req.body));
  if(mySchedule == null){
    res.status(400).send("Message system was not running");
  }
  else{
    mySchedule.shutDownSystem();
    console.log("Message System Stopped");
    mySchedule = null;
    res.status(200).send("Message System Stopped");
  }
});

app.get('/history', (req, res) => {
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

app.get('/api', (req, res) => {
  res.header("Access-Control-Allow-Origin: *");
  
  res.status(200).sendFile(__dirname+"/api/openapi.yaml")
});

app.post('/api/messages', (req, res) => {
  res.header("Access-Control-Allow-Origin: *");
  res.header('Content-Type', 'application/json');
  console.log(req.body.to);
  console.log(req.body.body);
  //res.status(200).send(JSON.stringify({ success: true }));
  Twilio.sendMessageWithResponse(req.body.to,req.body.body,res);
});

app.post('/api/messagesBulk', (req, res) => {
  res.header("Access-Control-Allow-Origin: *");
  res.header('Content-Type', 'application/json');
  console.log(req.body.Numbers);
  console.log(req.body.body);
  //res.status(200).send(JSON.stringify({ success: true }));
  Twilio.sendBulk(req.body.Numbers,req.body.body,res);
});

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
  
  var currentTime= moment().tz("America/Los_Angeles").format();
  db.setTime(id,currentTime);
  //res.status(200).send("Capture Registered");
  try{
    var device = mySchedule.getDeviceWithID(id);
  }
  catch(err){
    console.log("CAPTURE ERROR: Scheduler not running");
    res.status(400).send("CAPTURE ERROR: Scheduler not running");
    return;
  }
  
  //console.log("Device: ",device);
  if(device == null){
    console.log("ERROR: No matching ID");
    res.status(400).send("ERROR: No matching ID");
  }
  else{
    db.doCreateTimeStamp(time,id,reqDate,formattedTime);
    mySchedule.stopJob(id);
    res.status(200).send("Capture Registered");
  }
});

app.post('/updateAlarmTime',async (req,res)=>{
  res.header("Access-Control-Allow-Origin: *");
  console.log("body is : "+JSON.stringify(req.body));
  var currentTime= moment().tz("America/Los_Angeles").format();
  var id = req.body.device_id;
  console.log('id is ',id);
  try{
    var device = mySchedule.getDeviceWithID(id);
  }
  catch(err){
    console.log("UPDATE ERROR: Scheduler not running");
    res.status(400).send("UPDATE ERROR: Scheduler not running");
    return;
  }
  if(device == null){
    console.log("ERROR: No matching ID");
    res.status(400).send("ERROR: No matching ID");
  }
  else{
    db.setTime(id,currentTime);
    var snap = await db.getUser(id);
    var user = snap.val();
    var time = user.timeOfApplication;
    var comps = time.split(':');
    var today = new Date();
    var d = new Date(today.getFullYear(), today.getMonth(), today.getDay(), comps[0], comps[1]);
    var timeObj = {
      hour:d.getUTCHours(),
      minute:d.getUTCMinutes(),
      intervalOne: user.firstReminder,
      intervalTwo: user.secondReminder
    }
    res.status(200).send(timeObj);
  }
});

app.listen(8080, () => console.log('Backend API listening on port 8080!'))