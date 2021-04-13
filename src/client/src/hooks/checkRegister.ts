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
     return  await register(password, email, userFirstName, userLastName, userName);   
  }
}
