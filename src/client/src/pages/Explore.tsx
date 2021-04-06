import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCardContent,
  IonItem,
  IonIcon,
  IonLabel,
  IonImg,
  IonRefresher,
  IonRefresherContent,
} from "@ionic/react";
import { useEffect, useState } from "react";
import { db } from "../helper/firebase";
import { evaluateLocation } from "../hooks/evaluateLocation";
import { Plugins } from "@capacitor/core";
import { GeogramPosition } from "../model/GeogramPosition";
import { Picture } from "../model/Picture";
import { pin } from "ionicons/icons";
import React from "react";
import { RefresherEventDetail } from "@ionic/core";
import { chevronDownCircleOutline } from "ionicons/icons";

const { Geolocation } = Plugins;
const FILTER = 15;

const Explore: React.FC = (props) => {
  // Geoinformation
  const [location, setLocation] = useState<GeogramPosition>();

  //Pictures to update
  const [updatedPictures, setUpdatedPictures] = useState<Array<Picture>>([]);

  //Pictures to display
  const [pictures, setPictures] = useState<Array<Picture>>([]);

  useEffect(() => {
    // get current geolocation
    Geolocation.getCurrentPosition().then((location) => {
      setLocation({
        coords: {
          accuracy: location.coords.accuracy,
          altitude: location.coords.altitude,
          altitudeAccuracy: location.coords.altitudeAccuracy,
          heading: location.coords.heading,
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          speed: location.coords.speed,
        },
        timestamp: location.timestamp,
      });
    });

    let ref = db.collection("images");

    let unsubscribe = ref.onSnapshot(onCollectionUpdate);

    return () => {
      unsubscribe();
    };
  }, []);

  const onCollectionUpdate = (querySnapshot: any) => {
    let typedDocs: Picture[] = [];

    querySnapshot.forEach((doc: any) => typedDocs.push(doc.data()));

    if (location !== undefined) {
      setUpdatedPictures(
        evaluateLocation(
          FILTER,
          typedDocs,
          location.coords.latitude,
          location.coords.longitude
        )
      );
    }
  };

  function doRefresh(event: CustomEvent<RefresherEventDetail>) {
    console.log('Begin async operation');
  

    setPictures(updatedPictures);

    setTimeout(() => {
      console.log('Async operation has ended');
      event.detail.complete();
    }, 2000);
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Explore</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
      <IonContent>
      <IonRefresher slot="fixed" onIonRefresh={doRefresh} pullFactor={0.5} pullMin={100} pullMax={200}>
        <IonRefresherContent></IonRefresherContent>
      </IonRefresher>
    </IonContent>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Explore</IonTitle>
          </IonToolbar>
        </IonHeader>

        {pictures.map((picture) => {
          return (
            <IonCard>
              <IonItem>
                <IonIcon icon={pin} slot="start" />
                <IonLabel>
                  {picture.location.coords.latitude}{" "}
                  {picture.location.coords.longitude}
                </IonLabel>
              </IonItem>
              <IonCardHeader>
                <IonCardSubtitle>{picture.user}</IonCardSubtitle>
                <IonCardTitle>{picture.title}</IonCardTitle>
              </IonCardHeader>

              <IonCardContent>
                <IonImg src={picture.url}></IonImg>
              </IonCardContent>
            </IonCard>
          );
        })}
      </IonContent>
    </IonPage>
  );
};

export default Explore;
