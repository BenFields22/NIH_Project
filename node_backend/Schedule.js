const Cron = require("node-cron");
var DeviceInstance = require('./DeviceInstance');
var db = require('./db');
var Twilio = require('./messenger');

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
        var task = new Cron.schedule(time, ()=>{
        const d = new Date();
        console.log('Message Event at:',d);
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
      }
    }

    scheduleMessageJobs(){
      console.log("Querying Firebase");
      //query firebase for all users
      var task1 = this.createMessageEvent("0 18 * * *","Ben, Time to take Medication","+15412243874");
      var task2 = this.createMessageEvent("10 18 * * *","Ben, this is your first Reminder that it is time to take Medication","+15412243874");
      var task3 = this.createMessageEvent("30 18 * * *","Ben, this is your second Reminder that it is time to take Medication","+15412243874");
    
      //create deviceInstances
      console.log("Creating device Instances");
      var device = new DeviceInstance(0,task1,task2,task3);
    
      //place ieach device instance n dictionary with the DeviceID being the key
      console.log("Placing into Dictionary");
      var Mid = "CC:50:E3:B7:81:3C"
      this.mymap[Mid] = device;
      //start tasks
      device.startTasks();
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




