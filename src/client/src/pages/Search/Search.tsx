import React, { useEffect, useState } from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonSearchbar,
  IonItem,
  IonChip,
  IonLabel,
  IonIcon,
  IonListHeader,
  IonRow,
  IonCol,
  IonGrid,
  IonImg,
  IonPopover,
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonCardSubtitle,
  IonCardTitle,
  IonText,
} from "@ionic/react";
import { db } from "../../helper/firebase";
import { Image } from "../../model/Image";
import { pin } from "ionicons/icons";
import { GeolocationPosition, Plugins } from "@capacitor/core";
import { distanceInKm } from "../../hooks/evaluateDistance";

const { Geolocation } = Plugins;

const Search: React.FC = () => {
  const [filter, setFilter] = useState("");
  const [images, setImages] = useState<Array<Image>>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [popPic, setPopPic] = useState<Image>();
  // Geoinformation
  const [location, setLocation] = useState<GeolocationPosition>();

  useEffect(() => {
    (async () => {
      // push location to state
      setLocation(await Geolocation.getCurrentPosition());

      console.log("Initial load...");

      setImages(await fetchImages());
    })();
  }, []);

  async function fetchImages(): Promise<Image[]> {
    // fetch images from firebase
    const ref = db.collection("images");
    const data = await ref.get();

    // load images to typed docs
    let t: Image[] = [];
    data.docs.forEach((doc: any) => t.push(doc.data()));
    t.forEach((element: Image) => {
      if (location !== undefined && element.distance == undefined) {
        element.distance = distanceInKm(
          location?.coords.latitude,
          location?.coords.longitude,
          element.location.coords.latitude,
          element.location.coords.longitude
        );
      }
    });

    return t;
  }

  function filterItems(searchText: string) {
    console.log("filtering", searchText);
    let i: Image[] = [];

    if (searchText === "" || searchText === null || searchText === undefined) {
      fetchImages().then((res) => {
        setImages(res);
      });
    } else if (filter === "Location") {
      fetchImages().then((res) => {
        res.forEach((image) => {
          if (image.locationDetails?.[0].formatted.includes(searchText)) {
            i.push(image);
          }
        });
      });
    } else if (filter === "Title") {
      fetchImages().then((res) => {
        res.forEach((image) => {
          if (image.title.includes(searchText)) {
            i.push(image);
          }
        });
      });
    } else if (filter === "User") {
      fetchImages().then((res) => {
        res.forEach((image) => {
          if (image.user.includes(searchText)) {
            i.push(image);
          }
        });
      });
    }

    setImages(i);
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
          style={ filter === "Location" ? {backgroundColor: "lightgray", color: "black"} : {}}
          onClick={(e) => {
            setFilter("Location");
          }}
        >
          <IonLabel>Location</IonLabel>
        </IonChip>
        <IonChip
         style={ filter === "User" ? {backgroundColor: "lightgray", color: "black"} : {}}
          onClick={(e) => {
            setFilter("User");
          }}
        >
          <IonLabel>User</IonLabel>
        </IonChip>
        <IonChip
         style={ filter === "Title" ? {backgroundColor: "lightgray", color: "black"} : {}}
          onClick={(e) => {
            setFilter("Title");
          }}
        >
          <IonLabel>Title</IonLabel>
        </IonChip>

        <IonGrid>
          <IonRow>
            {images.map((p: Image) => {
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
                    {p.distance?.toPrecision(4)}
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
