import { db } from "../helper/firebase";
import { User } from "../model/User";

//Check Username
export async function checkUsername(userName: any): Promise<boolean> {
  var usernameCheck = db.collection("users");

  const data = await usernameCheck.get();
  let typedDocs: User[] = [];
  data.docs.forEach((doc: any) => typedDocs.push(doc.data().username));
  var len = typedDocs.length;

  for (var i = 0; i < len; i++) {
    if (typedDocs[i] === userName) {
      return true;
    }
  }
  return false;
}
