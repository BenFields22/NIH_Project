import { db } from './firebase';

// User API

export const doCreateUser = (id, username, email,Mid,phone,doctor,receiveMessages,mainMessage,secondMessage,timeOfApplication,firstReminder,secondReminder,lastCommunication) =>
  db.ref(`users/${Mid}`).set({
    username,
    email,
    id,
    phone,
    doctor,
    receiveMessages,
    mainMessage,
    secondMessage,
    timeOfApplication,
    firstReminder,
    secondReminder,
    lastCommunication
  });

  export const doCreateUserDoc = (id, username, email,Mid,phone,doctor) =>
    db.ref(`users/${Mid}`).set({
      username,
      email,
      id,
      phone,
      doctor
    });

  export const UpdateContentOfUser = (Mid,AppreceiveMessages,AppmainMessage,AppsecondMessage,ApptimeOfApplication,AppfirstReminder,AppsecondReminder) =>
    db.ref(`users/${Mid}`).update({
      receiveMessages:AppreceiveMessages,
      mainMessage:AppmainMessage,
      secondMessage:AppsecondMessage,
      timeOfApplication:ApptimeOfApplication,
      firstReminder:AppfirstReminder,
      secondReminder:AppsecondReminder
    });

export const getIDs = () => 
  db.ref('users').once('value');


export const onceGetUsers = () =>
  db.ref('users').once('value');

export const getStamps = (id) =>
  db.ref(`users/${id}/stamps`).once('value');

export const getUser = (id) =>
  db.ref(`users/${id}`).once('value');


// Other Entity APIs ...