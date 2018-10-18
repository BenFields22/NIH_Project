import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

var config = {
  apiKey: "AIzaSyBj03ShH6_QTD6f8rW0xKIRnW6UpHHCvm4",
  authDomain: "langlearn-4a75a.firebaseapp.com",
  databaseURL: "https://langlearn-4a75a.firebaseio.com",
  projectId: "langlearn-4a75a",
  storageBucket: "langlearn-4a75a.appspot.com",
  messagingSenderId: "515203610995"
};

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

const db = firebase.database();
const auth = firebase.auth();

export {
  db,
  auth,
};

