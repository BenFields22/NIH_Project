const Cron = require("node-cron");
var DeviceInstance = require('./DeviceInstance');
var Twilio = require('./messenger');
import { db } from './firebase';

class Schedule{
    constructor(){
        this.mymap = {};
        this.everydayScheduleSetupTask = Cron.schedule('1 0 * * *',()=>{
          var d = new Date();
          console.log("Running everydayScheduleSetupTask:",d);
          this.scheduleMessageJobs();
        }, {
          scheduled: false,
          timezone: "America/Los_Angeles"
        });
        this.everydayScheduleShutDownTask = Cron.schedule('59 23 * * *',()=>{
          var d = new Date();
          console.log("Running everydayScheduleShutDownTask:",d);
          this.shutDownTasks();
        }, {
          scheduled: false,
          timezone: "America/Los_Angeles"
        });
    }

    getDeviceWithID(id){
      return this.mymap[id];
    }
    
    createMessageEvent(time,msg,phone){
        console.log("Scheduling Messege Event for time: ",time, " with message: ",msg," to phone: ",phone);
        var task = new Cron.schedule(time, ()=>{
        const d = new Date();
        console.log('\nMessage Event at:',d);
        Twilio.sendMessage(phone,msg);
        console.log("Sending message '",msg,"' to phone number ",phone);
        }, {
          scheduled: false,
          timezone: "America/Los_Angeles"
        })
        return task;
    }

    shutDownTasks(){
      //loop through deviceInstances and shutdown tasks
      console.log("Shuting down tasks");
      for (var key in this.mymap){
        //console.log( key, mymap[key] );
        this.mymap[key].stopTasks();
        delete this.mymap[key];
      }
    }

    async scheduleMessageJobs(){
      console.log("Querying Firebase");
      //query firebase for all users
      var snap = await db.onceGetUsers();
      var users = snap.val();
      //console.log(users);
      var ids = Object.keys(users).filter(e => e !== "999");
      //console.log(ids);
      for(var i = 0;i<ids.length;i++){
        var time = users[ids[i]].timeOfApplication;
        var comps = time.split(':');
        var hour = parseInt(comps[0],10);
        var minute = parseInt(comps[1],10);
        var mainMessage = users[ids[i]].mainMessage;
        var phone = `+1${users[ids[i]].phone}`;
        var reminderMessage = users[ids[i]].secondMessage;
        var intervalOne = parseInt(users[ids[i]].firstReminder,10);
        var intervalTwo = parseInt(users[ids[i]].secondReminder,10);
        var task1 = this.createMessageEvent(`${minute} ${hour} * * *`,mainMessage,phone);
        var minute2 = minute+intervalOne;
        var hour2;
        if(minute2>60){
          hour2 = hour+1;
          minute2 = minute2-60;
        }
        else{
          hour2 = hour;
        }
        var task2 = this.createMessageEvent(`${minute2} ${hour2} * * *`,reminderMessage,phone);
        var minute3 = minute+intervalTwo;
        var hour3;
        if(minute2>60){
          hour3 = hour+1;
          minute3 = minute3-60;
        }
        else{
          hour3 = hour;
        }
        var task3 = this.createMessageEvent(`${minute3} ${hour3} * * *`,reminderMessage,phone);
      
        //create deviceInstances
        console.log("Creating device Instances");
        var device = new DeviceInstance(0,task1,task2,task3);
      
        //place each device instance in dictionary with the DeviceID being the key
        var Mid = ids[i];
        this.mymap[Mid] = device;
        if(users[ids[i]].receiveMessages == 1){
          //start tasks
          device.startTasks();
          console.log("starting tasks");
        }
        else{
          console.log("tasks not started");
          continue;
        }
      }
    }

    shutDownSystem(){
      this.everydayScheduleSetupTask.stop();
      this.everydayScheduleShutDownTask.stop();
      this.shutDownTasks();
    }

    startSystem(){
      this.everydayScheduleSetupTask.start();
      this.everydayScheduleShutDownTask.start();
      //testing next line
      this.scheduleMessageJobs();
    }

    stopJob(id){
      var device = this.mymap[id];
      device.stopTasks();
    }
}

module.exports = Schedule;




