import { auth, db } from "../helper/firebase";

import firebase from "firebase/app";

export async function checkAuthEmailWithUserCollectionEmail(
  user: firebase.User | null
) {
  db.collection("users")
    .doc(user?.uid)
    .get()
    .then(async (documentSnapshot) => {
      if (documentSnapshot.data()?.email === auth.currentUser?.email) {
        return;
      } else {
        db.collection("users").doc(user?.uid).update({
          email: auth.currentUser?.email,
        });
      }
    });
}
