import { distanceInKm } from "./evaluateDistance";

import { Image } from "../model/Image";
import { db } from "../helper/firebase";

export async function fetchImages(l?: any, username?: any): Promise<Image[]> {
  // fetch images from firebase
  const ref = db.collection("images");
  const data = await ref.get();

  // load images to typed docs
  let t: Image[] = [];

  //wenn es ind ShowUSerProfilaufgerufen wird in if 
  //wenn es in search aufgreufen wird in else
  if (username !== undefined) {    
    data.docs
      .filter((doc: any) => doc.data().user === username)
      .forEach((doc: any) => t.push(doc.data()));
  } else {   
    data.docs.forEach((doc: any) => t.push(doc.data()));
  }

  t.forEach((element: Image) => {
    if (l !== undefined && element.distance === undefined) {
      element.distance = distanceInKm(
        l?.coords.latitude,
        l?.coords.longitude,
        element.location.coords.latitude,
        element.location.coords.longitude
      );
    }
  });

  return t;
}
