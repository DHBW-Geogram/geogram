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
  IonText,
} from "@ionic/react";
import { useEffect, useState } from "react";
import { db } from "../helper/firebase";
import { evaluateLocation } from "../hooks/evaluateLocation";
import { Plugins } from "@capacitor/core";
import { GeogramPosition } from "../model/GeogramPosition";
import { Image } from "../model/Image";
import { pin } from "ionicons/icons";
import React from "react";
import { RefresherEventDetail } from "@ionic/core";
import { chevronDownCircleOutline } from "ionicons/icons";
import { sortImageArray } from "../hooks/sortImageArray";

const { Geolocation } = Plugins;
const FILTER = 15;

const Explore: React.FC = (props) => {
  // Geoinformation
  const [location, setLocation] = useState<GeogramPosition>();

  //images to update
  const [updatedImages, setUpdatedImages] = useState<Array<Image>>([]);

  //images to display
  const [images, setImages] = useState<Array<Image>>([]);

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

    initialLoad();

    let ref = db.collection("images");

    let unsubscribe = ref.onSnapshot(onCollectionUpdate);

    return () => {
      unsubscribe();
    };
  }, []);

  const initialLoad = async () => {
    const ref = db.collection("images");
    const data = await ref.get();
    let typedDocs: Image[] = [];
    data.docs.forEach((doc: any) => typedDocs.push(doc.data()));
    typedDocs = typedDocs.sort((a, b) => {
      return sortImageArray(a,b);
    });
    setImages(typedDocs);
  };

  const onCollectionUpdate = (querySnapshot: any) => {
    let typedDocs: Image[] = [];

    querySnapshot.forEach((doc: any) => typedDocs.push(doc.data()));

    if (location !== undefined) {
      setUpdatedImages(
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
    console.log("Begin async operation");

    if(updatedImages.length !== 0)
    {
      setImages(updatedImages);
    } 

    setTimeout(() => {
      console.log("Async operation has ended");
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
        <IonRefresher
          slot="fixed"
          onIonRefresh={doRefresh}
          pullFactor={0.5}
          pullMin={100}
          pullMax={200}
        >
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Explore</IonTitle>
          </IonToolbar>
        </IonHeader>

        {images.map((image) => {
          return (
            <IonCard>
              <IonItem>
                <IonIcon icon={pin} slot="start" />
                <IonLabel>
                  {image.location.coords.latitude}{" "}
                  {image.location.coords.longitude}
                </IonLabel>
              </IonItem>
              <IonCardHeader>
                <IonCardSubtitle>{image.user}</IonCardSubtitle>
                <IonCardTitle>{image.title}</IonCardTitle>
              </IonCardHeader>

              <IonCardContent>
                <IonImg src={image.url}></IonImg>
                <br />
                <IonText>{image.description}</IonText>
              </IonCardContent>
            </IonCard>
          );
        })}
      </IonContent>
    </IonPage>
  );
};

export default Explore;
