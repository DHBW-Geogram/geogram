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
  useIonViewWillEnter,
  useIonViewWillLeave,
  IonGrid,
  IonRow,
  IonCol,
} from "@ionic/react";
import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { Plugins } from "@capacitor/core";
import { funnel, image } from "ionicons/icons";
import React from "react";
import { RefresherEventDetail } from "@ionic/core";
import { Image } from "../../model/Image";
import { db } from "../../helper/firebase";
import { sortImageArray } from "../../hooks/sortImageArray";
import { evaluateLocation } from "../../hooks/evaluateLocation";
import ExploreCard from "../../components/ExploreCard/ExploreCard";
import { checkAuthEmailWithUserCollectionEmail } from "../../hooks/checkAuthEmailWithUserCollectionEmail";
import { UserContext } from "../..";
import { useStateWithPromise } from "../../hooks/useStateWithPromise";

const { Geolocation } = Plugins;

const Explore: React.FC<{
  temp: number;
  setTemp: Dispatch<SetStateAction<number>>;
  setLoading: Dispatch<SetStateAction<boolean>>;
}> = ({ setLoading, setTemp, temp }) => {
  // Geoinformation
  const [location, setLocation] = useStateWithPromise();

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

  const user = useContext(UserContext);

  useIonViewWillEnter(() => {
    setTemp(1);
  }, [temp]);

  useIonViewWillLeave(() => {
    setTemp(10);
  }, [temp]);

  useEffect(() => {
    if (temp === 1) {
      (async () => {
        checkAuthEmailWithUserCollectionEmail(user);

        // push location to state
        Geolocation.getCurrentPosition().then((s) => {
          setLocation(s);

          fetchImages(filter, s).then((images) => {
            setImages(images);
          });
        });
      })();
    }
  }, [temp, GeolocationPositionError]);

  async function fetchImages(i?: number, l?: any): Promise<Image[]> {
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
        setLoading(false);
        return t;
      }
    } else {
      if (i) {
        t = evaluateLocation(i, t, l.coords.latitude, l.coords.longitude);
        setLoading(false);
        return t;
      }
    }

    return [];
  }

  function doRefresh(event: CustomEvent<RefresherEventDetail>) {
    console.log("Begin async operation");

    fetchImages(filter, location).then((images) => setImages(images));

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
          <IonText
            style={{ marginRight: "0.25rem" }}
            slot="end"
            onClick={(e) => setShowPopup({ open: true, event: e.nativeEvent })}
          >
            {filter} km
          </IonText>
          <IonIcon
            style={{ margin: "0.5rem" }}
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
                  min={1}
                  max={30}
                  snaps={true}
                  step={1}
                  pin={true}
                  value={filter}
                  onIonChange={(e) => {
                    setFilter(e.detail.value as number);
                    setLoading(true);
                    setTimeout(() => 2000);
                  }}
                  onIonBlur={() => {
                    fetchImages(filter)
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
                  <IonLabel slot="start">1</IonLabel>
                  <IonLabel slot="end">30+</IonLabel>
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
        <IonGrid>
          <IonRow>
            {images.length > 0 &&
              images.map((image, id) => {
                return (
                  <IonCol key={id} size="12" sizeMd="6" sizeLg="4">
                    <ExploreCard image={image} />{" "}
                  </IonCol>
                );
              })}
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Explore;
