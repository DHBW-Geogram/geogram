import { eyeOffOutline, eyeOutline } from "ionicons/icons";

export async function hideShowPassword(passwordType: any) {
  var arr: any[] = [];

  if (passwordType === "password") {
    arr = ["text", eyeOffOutline];
  } else {
    arr = ["password", eyeOutline];
  }
  return arr;
}
