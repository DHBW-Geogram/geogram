import { auth } from "../../helper/firebase";

export async function emailVerified(): Promise<boolean> {
  if (auth.currentUser?.emailVerified) {
    return true;
  } else {
    return false;
  }
}

export async function sendEmailVerify() {
  auth.currentUser?.sendEmailVerification();
}
