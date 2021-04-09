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
  IonButton,
  IonPopover,
  IonList,
  IonListHeader,
  IonRange,
} from "@ionic/react";
import { useEffect, useState } from "react";
import { db } from "../helper/firebase";
import { evaluateLocation } from "../hooks/evaluateLocation";
import { Plugins } from "@capacitor/core";
import { GeogramPosition } from "../model/GeogramPosition";
import { Image } from "../model/Image";
import { pin, funnel } from "ionicons/icons";
import React from "react";
import { RefresherEventDetail } from "@ionic/core";
import { chevronDownCircleOutline } from "ionicons/icons";
import { sortImageArray } from "../hooks/sortImageArray";

const { Geolocation } = Plugins;

const Explore: React.FC = (props) => {
  // Geoinformation
  const [location, setLocation] = useState<GeogramPosition>();

  //images to update
  const [updatedImages, setUpdatedImages] = useState<Array<Image>>([]);
  const [allImages, setAllImages] = useState<Array<Image>>([]);

  //images to display
  const [images, setImages] = useState<Array<Image>>([]);

  //filter
  const [filter, setFilter] = useState(15);

  //popup
  const [showPopup, setShowPopup] = useState<{
    open: boolean;
    event: Event | undefined;
  }>({
    open: false,
    event: undefined,
  });

  useEffect(() => {
    // get current geolocation

    initialLoad();

    async function initialLoad() {
      // get location from gps sensor
      let location = await Geolocation.getCurrentPosition();

      // push location to state
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

      console.log("Initial load...");

      // fetch images from firebase
      const ref = db.collection("images");
      const data = await ref.get();

      // load images to typed docs
      let typedDocs: Image[] = [];
      data.docs.forEach((doc: any) => typedDocs.push(doc.data()));

      // sort image array
      typedDocs = typedDocs.sort((a, b) => {
        return sortImageArray(a, b);
      });

      // push images to state
      setAllImages(typedDocs);

      //evaluates the distance between the images and the current location and sets them as visible images
      setImages(
        evaluateLocation(
          filter,
          typedDocs,
          location.coords.latitude,
          location.coords.longitude
        )
      );

      console.log("filter", filter);
    }

    let ref = db.collection("images");

    let unsubscribe = ref.onSnapshot(onCollectionUpdate);

    return () => {
      unsubscribe();
    };
  }, []);

  function filterImages(n: number | undefined) {
    if (location !== undefined) {
      if (n !== undefined) {
        setFilter(n);
        setUpdatedImages(
          evaluateLocation(
            n,
            allImages,
            location.coords.latitude,
            location.coords.longitude
          )
        );
        console.log("updated", updatedImages, "n", n);
      } else {
        //Array that shows the new pictures when updated manually to avoid an unwanted scrolling to the top
        setUpdatedImages(
          evaluateLocation(
            filter,
            allImages,
            location.coords.latitude,
            location.coords.longitude
          )
        );
      }
    }
  }

  const onCollectionUpdate = (querySnapshot: any) => {
    // load images to local array
    let typedDocs: Image[] = [];
    querySnapshot.forEach((doc: any) => typedDocs.push(doc.data()));

    // set images new
    setAllImages(typedDocs);
    filterImages(undefined);
  };

  function doRefresh(event: CustomEvent<RefresherEventDetail>) {
    console.log("Begin async operation");

    if (updatedImages.length !== 0) {
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
          <IonText slot="end">{filter}km</IonText>
          <IonIcon
            icon={funnel}
            slot="end"
            onClick={(e) => setShowPopup({ open: true, event: e.nativeEvent })}
          />
          <IonPopover
            isOpen={showPopup.open}
            event={showPopup.event}
            onDidDismiss={(e) =>
              setShowPopup({ open: false, event: undefined })
            }
          >
            <IonList>
              <IonListHeader>Range Filter</IonListHeader>

              <IonItem>
                <IonRange
                  min={0}
                  max={100}
                  snaps={true}
                  step={5}
                  pin={true}
                  value={filter}
                  onIonChange={(e) => {
                    setFilter(e.detail.value as number);
                    filterImages(e.detail.value as number);
                  }}
                  onLostPointerCapture={(e) => {
                    setShowPopup({ open: false, event: undefined });
                  }}
                >
                  <IonLabel slot="start">0</IonLabel>
                  <IonLabel slot="end">100+</IonLabel>
                </IonRange>
              </IonItem>
            </IonList>
          </IonPopover>
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
                  {image.location.position
                    ? image.location.position
                    : image.location.coords.latitude +
                      " " +
                      image.location.coords.longitude}
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
