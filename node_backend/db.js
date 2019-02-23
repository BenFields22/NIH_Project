var admin = require("firebase-admin");
var serviceAccount = require('./privateKey.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://nihproject-1a5b4.firebaseio.com"
  });
const db = admin.database();


function doCreateTimeStamp(Unixtime,Mid, date,timeOfDay){
    db.ref(`users/${Mid}/stamps/${Unixtime}`).set({
        date,
        timeOfDay
        });
}

module.exports = {
    doCreateTimeStamp
}


    
