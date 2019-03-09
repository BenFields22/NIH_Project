import { db } from './firebase';


export const  doCreateTimeStamp = (Unixtime,Mid, date,timeOfDay)=>
    db.ref(`users/${Mid}/stamps/${Unixtime}`).set({
        date,
        timeOfDay
        });


export const onceGetUsers=()=>
    db.ref('users').once('value');

  

export const setTime=(Mid,time)=>
    db.ref(`users/${Mid}`).update({
        lastCommunication:time
        });

export const getUser = (id) =>
    db.ref(`users/${id}`).once('value');





    
