import { auth, db } from "../../helper/firebase";
import { presentAlert } from "../alert";
import { checkUsername } from "../checkUsername";

export async function signInWithUsernameAndPassword(
  username: any,
  password: any
): Promise<any> {
  
  if (await checkUsername(username)) {
    db.collection("users")
      .where("username", "==", username)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          auth
            .signInWithEmailAndPassword(doc.data().email, password)
            .catch((err) => presentAlert("Your Login credentials are incorrect"));
        });
      });
  } else {
    auth
      .signInWithEmailAndPassword(username, password)
      .catch((err) => presentAlert("Your Login credentials are incorrect"));
  }
}
