import { db } from "../helper/firebase";
import { Image } from "../model/Image";
import { presentAlert } from "./alert";

import firebase from "firebase/app";

export async function likeFunction(
  user: firebase.User | null,
  likeNumber: number,
  image: Image
): Promise<number> {
  //add liked image to user collection
  await db
    .collection("users")
    .doc(user?.uid)
    .update({
      likedImage: firebase.firestore.FieldValue.arrayUnion(image.id),
    })
    .catch((err) => presentAlert(err.message));

  var like = likeNumber;

  like += 1;

  //update like number in db
  await db
    .collection("images")
    .doc(image.id)
    .update({
      likes: like,
    })
    .catch((err) => presentAlert(err.message));
  return like;
}

export async function delikeFunction(
  user: firebase.User | null,
  likeNumber: number,
  image: Image
): Promise<number> {
  //remove deliked image in collection user
  await db
    .collection("users")
    .doc(user?.uid)
    .update({
      likedImage: firebase.firestore.FieldValue.arrayRemove(image.id),
    })
    .catch((err) => presentAlert(err.message));

  var like = likeNumber;

  like -= 1;

  //update like number in db
  await db
    .collection("images")
    .doc(image.id)
    .update({
      likes: like,
    })
    .catch((err) => presentAlert(err.message));

  return like;
}
