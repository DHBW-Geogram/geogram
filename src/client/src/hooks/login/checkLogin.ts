import { presentAlert } from "../alert";
import { signInWithUsernameAndPassword } from "./signInWithUsernameAndPassword";

export async function checkLogin(username: any, password: any) {
  if (username.length === 0) presentAlert("Email or Username Required");
  else if (password.length === 0) presentAlert("Password Required");
  else {
    await signInWithUsernameAndPassword(username, password);
  }
}
