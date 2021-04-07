/* eslint-disable react/jsx-no-undef */
import {
  IonButton,
  IonCol,
  IonContent,
  IonFab,
  IonFabButton,
  IonGrid,
  IonHeader,
  IonIcon,
  IonImg,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  IonRow,
  IonTextarea,
  IonTitle,
  IonToast,
  IonToolbar,
} from "@ionic/react";
import { list } from "ionicons/icons";
import { Image } from "../model/Image";
import { distanceInKm } from "./evaluateDistance";
import { sortImageArray } from "./sortImageArray";

export function evaluateLocation(
  range: number,
  images: Image[],
  lat: number,
  long: number
): Image[] {
  let pictures: Image[] = [];
  console.log(range);

  images.map((image) => {
    let distance: number = distanceInKm(
      lat,
      long,
      image.location.coords.latitude,
      image.location.coords.longitude
    );
    if (distance <= range) {
      image.distance = distance;
      pictures.push(image);
    }
  });

  pictures = pictures.sort((a, b) => {
    return sortImageArray(a,b);
  });

  console.log(pictures);

  return pictures;
}
