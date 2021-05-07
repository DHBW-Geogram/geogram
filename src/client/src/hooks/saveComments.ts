import { db } from "../helper/firebase";
import { presentAlert } from "./alert";

import firebase from "firebase/app";

export async function saveComments(imageId: any, commentData: any) {
  commentData.map(async (c: any) => {
    await db
      .collection("images")
      .doc(imageId)
      .update({
        comments: firebase.firestore.FieldValue.arrayUnion({
          comment: c.comment,
          userid: c.userid,
          timestamp: c.timestamp,
          id: c.id,
        }),
      })
      .catch((err) => presentAlert(err.message));
  });
}
