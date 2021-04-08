import React, { useEffect, useState } from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonSearchbar,
  IonItem,
  IonList,
  IonChip,
  IonLabel,
  IonAvatar,
  IonIcon,
  IonListHeader,
  IonRow,
  IonCol,
  IonGrid,
  IonImg,
  IonModal,
  IonButton,
  IonPopover,
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonCardSubtitle,
  IonCardTitle,
  IonText,
} from "@ionic/react";
import { db } from "../helper/firebase";
import { Image } from "../model/Image";
import { pin } from "ionicons/icons";
import { responsesAreSame } from "workbox-broadcast-update";
import { Plugins } from "@capacitor/core";
import { GeogramPosition } from "../model/GeogramPosition";
import { distanceInKm } from "../hooks/evaluateDistance";

const { Geolocation } = Plugins;

const Search: React.FC = () => {
  const [allimages, setAllimages] = useState<Array<Image>>([]);
  const [filteredImages, setFilteredImages] = useState<Array<Image>>([]);
  const [filter, setFilter] = useState("Location");
  const [showPopup, setShowPopup] = useState(false);
  const [popPic, setPopPic] = useState<Image>();
  // Geoinformation
  const [location, setLocation] = useState<GeogramPosition>();

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

    fetchImages();
    setFilteredImages(allimages);
    let ref = db.collection("images");

    let unsubscribe = ref.onSnapshot(onCollectionUpdate);

    return () => {
      unsubscribe();
    };
  }, []);

  const onCollectionUpdate = (querySnapshot: any) => {
    let typedDocs: Image[] = [];

    querySnapshot.forEach((doc: any) => typedDocs.push(doc.data()));
    setAllimages(typedDocs);
  };

  const fetchImages = async () => {
    console.log(allimages);
    const ref = db.collection("images");
    const data = await ref.get();
    let typedDocs: Image[] = [];
    data.docs.forEach((doc: any) => typedDocs.push(doc.data()));
    setAllimages(typedDocs);
  };

  function filterItems(searchText: string) {
    console.log("filtering", searchText);

    if (searchText === "" || searchText === null || searchText === undefined) {
      setFilteredImages(allimages);
    } else if (filter === "Location") {
      setFilteredImages(
        allimages.filter(
          (image: Image) =>
            image.location.coords.latitude.toPrecision(2) ===
            Number(searchText).toPrecision(2)
        )
      );
    } else if (filter === "Title") {
      setFilteredImages(
        allimages.filter((image: Image) => image.title.startsWith(searchText))
      );
    } else if (filter === "User") {
      setFilteredImages(
        allimages.filter((image: Image) => image.user.startsWith(searchText))
      );
    }
  }

  function getDistance(lat: number, long: number): number {
    if (
      location?.coords.longitude !== undefined &&
      location?.coords.latitude !== undefined
    ) {
      return distanceInKm(
        location.coords.latitude,
        location.coords.longitude,
        lat,
        long
      );
    }
    return 0;
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Search</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonSearchbar
          onIonChange={(e) => {
            filterItems((e.target as HTMLInputElement).value);
          }}
          showCancelButton="never"
        ></IonSearchbar>

        <IonListHeader>Filter: {filter}</IonListHeader>
        <IonChip
          onClick={(e) => {
            setFilter("Location");
          }}
        >
          <IonLabel>Location</IonLabel>
        </IonChip>
        <IonChip
          onClick={(e) => {
            setFilter("User");
          }}
        >
          <IonLabel>User</IonLabel>
        </IonChip>
        <IonChip
          onClick={(e) => {
            setFilter("Title");
          }}
        >
          <IonLabel>Title</IonLabel>
        </IonChip>

        <IonGrid>
          <IonRow>
            {filteredImages.map((p: Image) => {
              return (
                <IonCol size="4">
                  <IonImg
                    onClick={(e) => {
                      setShowPopup(true);
                      setPopPic(p);
                    }}
                    src={p.url}
                    style={{
                      objectFit: "cover",
                      height: "100%",
                      width: "100%",
                    }}
                  ></IonImg>
                  <p
                    style={{
                      position: "absolute",
                      bottom: "-10px",
                      right: "10px",
                      backgroundColor: "rgba(0,0,0,0.5)",
                      borderRadius: "5px",
                    }}
                  >
                    {getDistance(
                      p.location.coords.latitude,
                      p.location.coords.longitude
                    ).toPrecision(3)}
                    km
                  </p>
                </IonCol>
              );
            })}
          </IonRow>
        </IonGrid>
        <IonPopover
          isOpen={showPopup}
          onDidDismiss={(e) => setShowPopup(false)}
        >
          <IonCard>
            <IonItem>
              <IonIcon icon={pin} slot="start" />
              <IonLabel>
                {popPic?.location.coords.latitude}{" "}
                {popPic?.location.coords.longitude}
              </IonLabel>
            </IonItem>
            <IonCardHeader>
              <IonCardSubtitle>{popPic?.user}</IonCardSubtitle>
              <IonCardTitle>{popPic?.title}</IonCardTitle>
            </IonCardHeader>

            <IonCardContent>
              <IonImg src={popPic?.url}></IonImg>
              <br />
              <IonText>{popPic?.description}</IonText>
            </IonCardContent>
          </IonCard>
        </IonPopover>
      </IonContent>
    </IonPage>
  );
};

export default Search;
