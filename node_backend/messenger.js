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

function sendBulk(numbers,body,res){
    Promise.all(
        numbers.map(number => {
          return client.messages.create({
            to: number,
            from: process.env.TWILIO_MESSAGING_SERVICE_SID,
            body: body
          });
        })
      )
        .then(messages => {
          console.log('Messages sent!');
          res.status(200).send(JSON.stringify({ success: true }));
        })
        .catch(err => {
            console.error(err);
            res.status(400).send(JSON.stringify({ error: err }));
        })
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
          res.status(200).send(JSON.stringify({ success: true }));
      })
      .catch(err => {
          console.log(err);
          res.status(400).send(JSON.stringify({ error: err }));
      });
}

module.exports = {
    sendMessageWithResponse,
    sendMessage,
    sendBulk
}

