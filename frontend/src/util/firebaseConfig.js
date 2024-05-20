// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

//Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC_eeDq-JSCpgPQQj9EMmC0LdpwdiwJTtg",
    authDomain: "paf-power-pluse-cd42c.firebaseapp.com",
    projectId: "paf-power-pluse-cd42c",
    storageBucket: "paf-power-pluse-cd42c.appspot.com",
    messagingSenderId: "604976872212",
    appId: "1:604976872212:web:898f2ae2a407d4cbc46001",
    measurementId: "G-5LKDB7L716"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
export default storage;