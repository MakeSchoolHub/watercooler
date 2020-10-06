import * as firebase from 'firebase';
import firestore from 'firebase/firestore'

const settings = {timestampsInSnapshots: true};

const config = {
    projectId: `${process.env.FIREBASE_PROJECT_ID}`,
    apiKey: `${process.env.FIREBASE_API_KEY}`,
    databaseURL: "https://bonfire-3204e.firebaseio.com/"
    //databaseURL: `${process.env.FIREBASE_DATABASE_URL}`
  };
console.log('safksjfdhkdsljhflskjhf');
firebase.initializeApp(config);

firebase.firestore().settings(settings);

export default firebase;
