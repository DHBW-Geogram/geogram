import { auth, db } from "../helper/firebase";


export async function signInWithUsernameAndPassword(
  username: any,
  password: any
) {
  db.collection("users")
    .where("username", "==", username)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        auth
          .signInWithEmailAndPassword(doc.data().email, password)
          .catch((err) => console.log(err.message));
      });
    });
}
