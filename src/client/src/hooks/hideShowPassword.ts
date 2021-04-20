import { eyeOffOutline, eyeOutline } from "ionicons/icons";


export async function hideShowPassword(passwordType: any) {
    
    var arr: any[] = [];

    if (passwordType === "password") {
        arr = ["text", eyeOffOutline]
        // setpasswordType("text");
        // setPasswordShowHideIcon(eyeOffOutline);
      } else {
        arr = ["password", eyeOutline]
        // setpasswordType("password");
        // setPasswordShowHideIcon(eyeOutline);
      }
      return arr;
}