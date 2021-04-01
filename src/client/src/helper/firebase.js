import firebase from "firebase";

const firebaseConfig = {
    apiKey: "AIzaSyCuOUn1kd_QKs91UYx2Pv015QYAwNfpkWg",
    authDomain: "geogram-4906f.firebaseapp.com",
    projectId: "geogram-4906f",
    storageBucket: "geogram-4906f.appspot.com",
    messagingSenderId: "293875577588",
    appId: "1:293875577588:web:d286bacade6e4850bfa4a1"
};
// Configure
let fb = firebase.initializeApp(firebaseConfig);
let db = fb.firestore();

// AUTH //
fb.auth();

// [START auth_state_listener]
fb.auth().onAuthStateChanged((user) => {
    if (user) {
        var uid = user.uid;
        localStorage.setItem("uid", uid);
        console.log("RES:",fb.auth())
    } else {
        localStorage.removeItem("uid", uid);
    }
});
// [END auth_state_listener]


export { db, fb };