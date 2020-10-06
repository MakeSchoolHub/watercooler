import * as firebase from 'firebase';
import firestore from 'firebase/firestore'

const settings = {timestampsInSnapshots: true};

const config = {
    projectId: 'YOUR_FIREBASE_PROJECT_ID',
    apiKey: 'YOUR_API_KEY',
    databaseURL: 'YOUR_DATABASE_URL'
  };
firebase.initializeApp(config);

firebase.firestore().settings(settings);

export default firebase;
