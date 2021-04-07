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
import { Picture } from "../model/Picture";
import { pin } from "ionicons/icons";
import { responsesAreSame } from "workbox-broadcast-update";
import { Plugins } from "@capacitor/core";
import { GeogramPosition } from "../model/GeogramPosition";
import { distanceInKm } from "../hooks/evaluateDistance";

const { Geolocation } = Plugins;

const Search: React.FC = () => {
  const [allPictures, setAllPictures] = useState<Array<Picture>>([]);
  const [filteredPictures, setFilteredPictures] = useState<Array<Picture>>([]);
  const [filter, setFilter] = useState("Location");
  const [showPopup, setShowPopup] = useState(false);
  const [popPic, setPopPic] = useState<Picture>();
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
    setFilteredPictures(allPictures);
  }, []);

  const fetchImages = async () => {
    console.log(allPictures);
    const ref = db.collection("images");
    const data = await ref.get();
    let typedDocs: Picture[] = [];
    data.docs.forEach((doc: any) => typedDocs.push(doc.data()));
    setAllPictures(typedDocs);
  };

  function filterItems(searchText: string) {
    console.log("filtering", searchText);

    if (searchText === "" || searchText === null || searchText === undefined) {
      setFilteredPictures(allPictures);
    } else if (filter === "Location") {
      setFilteredPictures(
        allPictures.filter(
          (picture: Picture) =>
            picture.location.coords.latitude.toPrecision(2) ===
            Number(searchText).toPrecision(2)
        )
      );
    } else if (filter === "Title") {
      setFilteredPictures(
        allPictures.filter((picture: Picture) =>
          picture.title.startsWith(searchText)
        )
      );
    } else if (filter === "User") {
      setFilteredPictures(
        allPictures.filter((picture: Picture) =>
          picture.user.startsWith(searchText)
        )
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
            {
              filterItems((e.target as HTMLInputElement).value);
            }
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
            {filteredPictures.map((p: Picture) => {
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
                  <p style={{position:"absolute", bottom:"-10px", right:"10px", backgroundColor:"rgba(0,0,0,0.5)"}}>
                    {getDistance(
                      p.location.coords.latitude,
                      p.location.coords.longitude
                    ).toPrecision(3)}km
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
            </IonCardContent>
          </IonCard>
        </IonPopover>
      </IonContent>
    </IonPage>
  );
};

export default Search;
