import { presentAlert } from "../alert";
import { checkUsername } from "../checkUsername";
import { register } from "./register";

export async function checkRegister(
  confirmPassword: any,
  password: any,
  email: any,
  userFirstName: any,
  userLastName: any,
  userName: any
): Promise<any> {
  if (userName.length === 0)  presentAlert("Username Required");
  else if (await checkUsername(userName)) presentAlert("Username already taken");
  else if (userFirstName.length === 0) presentAlert("Firstname Required");
  else if (userLastName.length === 0) presentAlert("Secondname Required");
  else if (email.length === 0) presentAlert("Email Required");
  else if (password.length === 0) presentAlert("Password Required");
  else if (password.length < 6) presentAlert("Password to short");
  else if (confirmPassword !== password) presentAlert("Password don't match");
  else {
    await register(password, email, userFirstName, userLastName, userName);   
  }
}
