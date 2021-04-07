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
  const [filterArray, setFilterArray] = useState<Array<number>>([]);

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

    setFilterArray([5, 10, 15, 20]);
    initialLoad();

    let ref = db.collection("images");

    let unsubscribe = ref.onSnapshot(onCollectionUpdate);

    return () => {
      unsubscribe();
    };
  }, []);

  //Gets the initally stored pictures from the db
  const initialLoad = async () => {
    const ref = db.collection("images");
    const data = await ref.get();
    let typedDocs: Image[] = [];
    data.docs.forEach((doc: any) => typedDocs.push(doc.data()));
    typedDocs = typedDocs.sort((a, b) => {
      return sortImageArray(a, b);
    });
    setAllImages(typedDocs);
  };

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
    let typedDocs: Image[] = [];

    querySnapshot.forEach((doc: any) => typedDocs.push(doc.data()));
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
              <IonItem
                button={true}
                onClick={(e) => {
                  filterImages(5);
                  setShowPopup({ open: false, event: undefined });
                }}
                detail
              >
                5km
              </IonItem>
              <IonItem
                button={true}
                onClick={(e) => {
                  filterImages(10);
                  setShowPopup({ open: false, event: undefined });
                }}
                detail
              >
                10km
              </IonItem>
              <IonItem
                button={true}
                onClick={(e) => {
                  filterImages(15);
                  setShowPopup({ open: false, event: undefined });
                }}
                detail
              >
                15km
              </IonItem>
              <IonItem
                button={true}
                onClick={(e) => {
                  filterImages(20);
                  setShowPopup({ open: false, event: undefined });
                }}
                detail
              >
                20km
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
