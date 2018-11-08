import firebase from 'firebase/app';
import 'firebase/database';

var config = {
  apiKey: "AIzaSyC-eySP34r8FiVplue7f1MvZIzzG00yhS8",
  authDomain: "nihproject-1a5b4.firebaseapp.com",
  databaseURL: "https://nihproject-1a5b4.firebaseio.com",
  projectId: "nihproject-1a5b4",
  storageBucket: "nihproject-1a5b4.appspot.com",
  messagingSenderId: "242879493350"
};

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

const db = firebase.database();

export {
  db
};

