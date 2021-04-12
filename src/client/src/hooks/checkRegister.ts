import { auth, db } from "../helper/firebase";
import { checkUsername } from "./checkUsername";
import { register } from "./register";

export async function checkRegister(
  confirmPassword: any,
  password: any,
  email: any,
  userFirstName: any,
  userLastName: any,
  userName: any
): Promise<any> {
  if (userName.length === 0) return "Username Required";
  else if (await checkUsername(userName)) return "Username already taken";
  else if (userFirstName.length === 0) return "Firstname Required";
  else if (userLastName.length === 0) return "Secondname Required";
  else if (email.length === 0) return "Email Required";
  else if (password.length === 0) return "Password Required";
  else if (password.length < 6) return "Password to short";
  else if (confirmPassword !== password) return "Password don't match";
  else {
     return await register(confirmPassword, password, email, userFirstName, userLastName, userName);
  //   await auth
  //     .createUserWithEmailAndPassword(email, password)
  //     .then(async (userCredential) => {
  //       var user = userCredential.user;
  //       user?.sendEmailVerification();
        
  //       //Setup firestore data

  //       const  data = {
  //         username: userName,
  //         userFirstName: userFirstName,
  //         userLastName: userLastName,
  //         email: email,
  //       };
  //       await db.collection("users")
  //         .doc(auth.currentUser?.uid)
  //         .set(data)
  //         .catch((err) => {
  //         //  console.log(err.message);
  //           return err.message;
  //         });
  //     })
  //     .catch((err) => {
  //       console.log(err.message);
  //       return err.message;
  //     });
 }
 
  // return "";
}
