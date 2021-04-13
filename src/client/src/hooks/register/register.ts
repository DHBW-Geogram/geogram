import { auth, db } from "../../helper/firebase";
import { presentAlert, presentAlertWithHeader } from "../alert";




export async function register(
  password: any,
  email: any,
  userFirstName: any,
  userLastName: any,
  userName: any
): Promise<any> {

  await  auth
    .createUserWithEmailAndPassword(email, password)
    .then(async (userCredential) => {
      var user = userCredential.user;
      user?.sendEmailVerification();

      //Alert wird nicht angezeigt
      //setalertEmailVerify(true);
      //Setup firestore data
     

      const data = {
        username: userName,
        userFirstName: userFirstName,
        userLastName: userLastName,
        email: email,
      };
      await db.collection("users")
        .doc(auth.currentUser?.uid)
        .set(data)
        .catch((err) => presentAlert(err.message));
    })    
    .catch((err) => presentAlert(err.message));    
  return "";
}
