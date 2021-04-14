import { auth } from "../../helper/firebase";
import { presentAlert } from "../alert";

export async function emailVerified(): Promise<boolean> { 
    
   
  if (auth.currentUser?.emailVerified) {       
    return true;
  } else {       
    return false;
  }  
}

export async function sendEmailVerify() {
    auth.currentUser?.sendEmailVerification();
    presentAlert("Email to Verify your Accout was send");
}