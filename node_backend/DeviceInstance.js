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

  module.exports = DeviceInstance;