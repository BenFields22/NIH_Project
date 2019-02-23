const dotenv = require('dotenv');
dotenv.config();

const client = require('twilio')(
    process.env.TWILIO_ACCOUT_SID,
    process.env.TWILIO_AUTH_TOKEN
);

function sendMessage(to,msg){
    client.messages
      .create({
          from: process.env.TWILIO_PHONE_NUMBER,
          to: to,
          body: msg
      })
      .then(() => {
          console.log("Twilio success");
      })
      .catch(err => {
          console.log(err);
      });
}

function sendMessageWithResponse(to,msg,res){
    client.messages
      .create({
          from: process.env.TWILIO_PHONE_NUMBER,
          to: to,
          body: msg
      })
      .then(() => {
          console.log("success");
          res.status(200).send("Success");
      })
      .catch(err => {
          console.log(err);
          res.status(400).send(err);
      });
}

module.exports = {
    sendMessageWithResponse,
    sendMessage
}

