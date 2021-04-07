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
import { Picture } from "../model/Picture";
import { distanceInKm } from "./evaluateDistance";

export function evaluateLocation(
  range: number,
  images: Picture[],
  lat: number,
  long: number
): Picture[] {
  let pictures: Picture[] = [];

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

  pictures.sort((a, b) => {
    if (a.distance !== undefined && b.distance !== undefined) {
      if (a.distance > b.distance) {
        return 1;
      } else if (a.distance < b.distance) {
        return -1;
      } else {
        return 0;
      }
    } else {
      return 0;
    }
  });

  console.log(pictures);

  return pictures;
}


