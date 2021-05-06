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
import axios from "axios";
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
  

  images.forEach((image) => {
    let distance: number = distanceInKm(
      lat,
      long,
      image.location.coords.latitude,
      image.location.coords.longitude
    );

    if (distance <= range) {
      pictures.push({...image, distance: distance});
    } else if(range === 30)
    {
      pictures.push({...image, distance: distance});
    }
  });

  pictures = pictures.sort((a, b) => {
    return sortImageArray(a, b);
  });

  

  return pictures;
}
