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

function degreesToRadians(degrees: number) {
  return (degrees * Math.PI) / 180;
}

function distanceInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  var earthRadiusKm = 6371;

  var dLat = degreesToRadians(lat2 - lat1);
  var dLon = degreesToRadians(lon2 - lon1);

  lat1 = degreesToRadians(lat1);
  lat2 = degreesToRadians(lat2);

  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusKm * c;
}
