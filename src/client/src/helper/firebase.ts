import firebase from "firebase";

const firebaseConfig = {
  //backup
  apiKey: "AIzaSyBXSt86U-kxZjHd6K6n_Ja13z0naCXnw0w",
  authDomain: "geogram-backup.firebaseapp.com",
  projectId: "geogram-backup",
  storageBucket: "geogram-backup.appspot.com",
  messagingSenderId: "308731272904",
  appId: "1:308731272904:web:4503db99c094a163eccffd",
  measurementId: "G-DYTVK15115",

  // apiKey: "AIzaSyCuOUn1kd_QKs91UYx2Pv015QYAwNfpkWg",
  // authDomain: "geogram-4906f.firebaseapp.com",
  // projectId: "geogram-4906f",
  // storageBucket: "geogram-4906f.appspot.com",
  // messagingSenderId: "293875577588",
  // appId: "1:293875577588:web:d286bacade6e4850bfa4a1"
};

// Configure
let fb = firebase.initializeApp(firebaseConfig);
let db = fb.firestore();

// AUTH //
export const auth = fb.auth();

export default firebase;

// [START auth_state_listener]
auth.onAuthStateChanged((user: any) => {
  if (user) {
    var uid: any = user.uid;
    localStorage.setItem("uid", uid);
    //  console.log("RES:",auth)
  } else {
    localStorage.removeItem("uid");
  }
});
// [END auth_state_listener]

export { db, fb };
