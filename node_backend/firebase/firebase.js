import firebase from 'firebase/app';
import 'firebase/database';

var config = {
  apiKey: "AIzaSyAUy2SEKALGKLumGpogdavYUJqCxZZA7YY",
  authDomain: "nihproject-a3ab9.firebaseapp.com",
  databaseURL: "https://nihproject-a3ab9.firebaseio.com",
  projectId: "nihproject-a3ab9",
  storageBucket: "nihproject-a3ab9.appspot.com",
  messagingSenderId: "218935453929"
};

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

const db = firebase.database();

export {
  db
};