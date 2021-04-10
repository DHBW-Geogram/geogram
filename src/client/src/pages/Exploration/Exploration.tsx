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
import { Dispatch, SetStateAction, useEffect, useState } from "react";
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

const Explore: React.FC<{ setLoading: Dispatch<SetStateAction<boolean>> }> = ({
  setLoading,
}) => {
  // Geoinformation
  const [location, setLocation] = useState<GeolocationPosition | undefined>();

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
      // push location to state
      setLocation(await Geolocation.getCurrentPosition());

      console.log("Initial load...");

      setImages(await fetchImages());
    })();
  }, []);

  async function fetchImages(i?: number): Promise<Image[]> {
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

    if (location !== undefined) {
      if (i) {
        t = evaluateLocation(
          i,
          t,
          location.coords.latitude,
          location.coords.longitude
        );
      } else {
        t = evaluateLocation(
          filter,
          t,
          location.coords.latitude,
          location.coords.longitude
        );
      }
    }

    return t;
  }

  function doRefresh(event: CustomEvent<RefresherEventDetail>) {
    console.log("Begin async operation");

    fetchImages().then((images) => setImages(images));

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
                    setLoading(true);
                    fetchImages(e.detail.value as number)
                      .then((images) => {
                        setImages(images);
                        setLoading(false);
                      })
                      .catch((e) => setLoading(false));
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