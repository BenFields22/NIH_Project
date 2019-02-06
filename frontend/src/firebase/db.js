import { db } from './firebase';

// User API

export const doCreateUser = (id, username, email,Mid,phone,doctor) =>
  db.ref(`users/${Mid}`).set({
    username,
    email,
    id,
    phone,
    doctor
  });

export const getIDs = () => 
  db.ref('users').once('value');


export const onceGetUsers = () =>
  db.ref('users').once('value');

export const getStamps = (id) =>
  db.ref(`users/${id}/stamps`).once('value');

export const onceGetWords = () =>
  db.ref('words').once('value');

// Other Entity APIs ...