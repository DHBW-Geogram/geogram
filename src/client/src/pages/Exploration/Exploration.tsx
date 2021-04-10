import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonItem,
  IonIcon,
  IonLabel,
  IonRefresher,
  IonRefresherContent,
  IonText,
  IonPopover,
  IonList,
  IonListHeader,
  IonRange,
} from "@ionic/react";
import { useEffect, useState } from "react";
import { GeolocationPosition, Plugins } from "@capacitor/core";
import { pin, funnel } from "ionicons/icons";
import React from "react";
import { RefresherEventDetail } from "@ionic/core";
import { chevronDownCircleOutline } from "ionicons/icons";
import { GeogramPosition } from "../../model/GeogramPosition";
import { Image } from "../../model/Image";
import { db } from "../../helper/firebase";
import { sortImageArray } from "../../hooks/sortImageArray";
import { evaluateLocation } from "../../hooks/evaluateLocation";
import ExploreCard from "../../components/ExploreCard/ExploreCard";

const { Geolocation } = Plugins;

const Explore: React.FC = (props) => {
  // Geoinformation
  const [location, setLocation] = useState<GeolocationPosition>();

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
    (async () => {
      // get location from gps sensor
      let location = await Geolocation.getCurrentPosition();

      // push location to state
      setLocation(location);

      console.log("Initial load...");

      let data: Image[] = await fetchImages();

      //evaluates the distance between the images and the current location and sets them as visible images
      setImages(
        evaluateLocation(
          filter,
          data,
          location.coords.latitude,
          location.coords.longitude
        )
      );
    })();
  }, []);

  async function fetchImages(): Promise<Image[]> {
    // fetch images from firebase
    const ref = db.collection("images");
    const data = await ref.get();

    // load images to typed docs
    let t: Image[] = [];
    data.docs.forEach((doc: any) => t.push(doc.data()));

    // sort image array
    t = t.sort((a, b) => {
      return sortImageArray(a, b);
    });

    return t;
  }

  function doRefresh(event: CustomEvent<RefresherEventDetail>) {
    console.log("Begin async operation");

    fetchImages().then(images => setImages(images));

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
          <IonText slot="end">{filter} km</IonText>
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
        {images.length > 0 &&
          images.map((image, id) => {
            return <ExploreCard key={id} image={image} />;
          })}
      </IonContent>
    </IonPage>
  );
};

export default Explore;
