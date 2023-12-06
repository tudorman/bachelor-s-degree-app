import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

export function initializeDatabase() {
  const firebaseConfig = {
    apiKey: "AIzaSyAFqvP9RUh-YYE9u-cWMWccZM58VLaTvjo",
    authDomain: "tomairdb.firebaseapp.com",
    databaseURL: "https://tomairdb-default-rtdb.firebaseio.com/",
    projectId: "tomairdb",
    storageBucket: "tomairdb.appspot.com",
    messagingSenderId: "702619029108",
    appId: "1:702619029108:web:f1a10b5a827f6a87e90b21",
  };

  const app = initializeApp(firebaseConfig);
  const database = getDatabase(app);
  return database;
}
