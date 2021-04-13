import { auth, db } from "../helper/firebase";

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
        //return von error geht nicht
        .catch((err) => {
          console.log("bin dort");
          return err.message;
        });
    })
    //return von error geht nicht
    .catch((err) => {
     
      console.log(err.message);      
      return err.message;
    });
    
  return "";
}
