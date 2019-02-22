var express = require('express');
const Cron = require("node-cron");
var cors = require('cors');
var app = express();
var bodyParser = require('body-parser');
var admin = require("firebase-admin");
const dotenv = require('dotenv');
dotenv.config();
var serviceAccount = require('./privateKey.json');
const client = require('twilio')(
  process.env.TWILIO_ACCOUT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://nihproject-1a5b4.firebaseio.com"
});

const db = admin.database();

var posts = [];
var mymap = {};
class DeviceInstance {
  constructor(val,task1,task2,task3) {
    this.takenFlag = val;
    this.FirstMessage = task1;
    this.SecondMessage = task2;
    this.ThirdMessage = task3;
  }
  hasTaken() {
    return this.takenFlag;
  }
  setTaken(){
    this.takenFlag = 1;
  }
  startTasks(){
    console.log("Starting tasks");
    this.FirstMessage.start();
    this.SecondMessage.start();
    this.ThirdMessage.start();
    console.log("Tasks Started");
  }
  stopTasks(){
    console.log("Stopping tasks");
    this.FirstMessage.stop();
    this.SecondMessage.stop();
    this.ThirdMessage.stop();
    console.log("Tasks Stopped");
  }
}

function createMessageEvent(time,msg,phone){
    var task = new Cron.schedule(time, ()=>{
    const d = new Date();
    console.log('Message Event at:',d);
    sendMessage(msg,phone);
    }, {
      scheduled: false,
      timezone: "America/Los_Angeles"
    })
    return task;
}

function sendMessage(msg,phone){
  console.log("Phone Number:",phone);
  console.log("Message:",msg);
  console.log("Sending...");
  console.log("Sent");
}

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

function shutDownTasks(){
  //loop through deviceInstances and shutdown tasks
  console.log("Shuting down tasks");
  for (var key in mymap){
    //console.log( key, mymap[key] );
    mymap[key].stopTasks();
  }
}

function ScheduleMessageJobs(){
  console.log("Querying Firebase");
  //query firebase for all users


  var task1 = createMessageEvent("1,3,5,7,9,11,13,15,17,19 * * * * *","Time to take Medication","+15412243874");
  var task2 = createMessageEvent("21,23,25,27,29,31,33,35,37,39 * * * * *","Reminder1: Time to take Medication","+15412243874");
  var task3 = createMessageEvent("41,43,45,47,49,51,53,55,57,59 * * * * *","Reminder2: Time to take Medication","+15412243874");

  //create deviceInstances
  console.log("Creating device Instances");
  var device = new DeviceInstance(0,task1,task2,task3);

  //place ieach device instance n dictionary with the DeviceID being the key
  console.log("Placing into Dictionary");
  var Mid = "111"
  mymap[Mid] = device;
  //start tasks
  device.startTasks();

}

var everydayScheduleSetupTask = Cron.schedule('1 0 * * *',()=>{
  var d = new Date();
  console.log("Running everydayScheduleSetupTask:",d);
  ScheduleMessageJobs();
}, {
  scheduled: false,
  timezone: "America/Los_Angeles"
});

var everydayScheduleShutDownTask = Cron.schedule('59 11 * * *',()=>{
  var d = new Date();
  console.log("Running everydayScheduleShutDownTask:",d);
  shutDownTasks();
}, {
  scheduled: false,
  timezone: "America/Los_Angeles"
});

app.get('/clear',(req,res)=>{
  posts = [];
  res.status(200).send("array cleared");
});

app.get('/startMessageSystem',(req,res)=>{
  res.header("Access-Control-Allow-Origin: *");
  console.log("body is : "+JSON.stringify(req.body));
  everydayScheduleSetupTask.start();
  everydayScheduleShutDownTask.start();
  //********************
  //testing code remove before production
  ScheduleMessageJobs();
  //******************** */
  console.log("Message System Started");
  res.status(200).send("Message System Started");
});

app.get('/stopMessageSystem',(req,res)=>{
  res.header("Access-Control-Allow-Origin: *");
  console.log("body is : "+JSON.stringify(req.body));
  everydayScheduleSetupTask.stop();
  everydayScheduleShutDownTask.stop();
  shutDownTasks();
  console.log("Message System Stopped");
  res.status(200).send("Message System Stopped");
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





app.post('/api/messages', (req, res) => {
  res.header('Content-Type', 'application/json');
  console.log(req.body.to)
  console.log(req.body.body)
  client.messages
      .create({
          from: process.env.TWILIO_PHONE_NUMBER,
          to: req.body.to,
          body: req.body.body
      })
      .then(() => {
          res.send(JSON.stringify({ success: true }));
      })
      .catch(err => {
          console.log(err);
          res.send(JSON.stringify({ success: false }));
      });
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
  var device = mymap[id];
  //console.log("Device: ",device);
  if(device == null){
    console.log("ERROR: No matching ID");
    res.status(400).send("No matching ID");
  }
  else{
    doCreateTimeStamp(time,id,reqDate,formattedTime);
    device.stopTasks();
    res.status(200).send("Capture Registered");
  }
});

app.post('/updateAlarmTime',(req,res)=>{
  res.header("Access-Control-Allow-Origin: *");
  console.log("body is : "+JSON.stringify(req.body));
  var time = {
    hour:6,
    minute:30
  }
  res.status(200).send(time);
});

app.listen(8080, () => console.log('Backend API listening on port 8080!'))