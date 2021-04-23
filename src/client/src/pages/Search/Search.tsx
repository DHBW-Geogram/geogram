import React, { useCallback, useEffect, useState } from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonSearchbar,
  IonChip,
  IonLabel,
  IonListHeader,
  IonRow,
  IonCol,
  IonGrid,
  IonImg,
  IonPopover,
} from "@ionic/react";
import { db } from "../../helper/firebase";
import { Image } from "../../model/Image";
import { GeolocationPosition, Plugins } from "@capacitor/core";
import { distanceInKm } from "../../hooks/evaluateDistance";
import ExploreCard from "../../components/ExploreCard/ExploreCard";
import "./Search.css";

const { Geolocation } = Plugins;

const Search: React.FC = () => {
  const [filter, setFilter] = useState("Location");
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
  }, [setLocation, setImages, GeolocationPositionError ]);

  // async function fetchImages(): Promise<Image[]> {
    const fetchImages = useCallback(async () =>  {
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
  }, [location, location])

  function filterItems(searchText: string) {
    console.log("filtering", searchText);

    if (searchText === "" || searchText === null || searchText === undefined) {
      fetchImages().then((res) => {
        setImages(res);
      });
    } else if (filter === "Location") {
      fetchImages().then((res) => {
        let i: Image[] = [];
        res.forEach((image) => {
          if (image.location.position?.includes(searchText)) {
            i.push(image);
          }
        });
        setImages(i);
      });
    } else if (filter === "Title") {
      fetchImages().then((res) => {
        let i: Image[] = [];
        res.forEach((image) => {
          if (image.title.includes(searchText)) {
            i.push(image);
          }
        });
        setImages(i);
      });
    } else if (filter === "User") {
      fetchImages().then((res) => {
        let i: Image[] = [];
        res.forEach((image) => {
          if (image.user.includes(searchText)) {
            i.push(image);
          }
        });
        setImages(i);
      });
    }
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
          style={
            filter === "Location"
              ? { backgroundColor: "lightgray", color: "black" }
              : {}
          }
          onClick={(e) => {
            setFilter("Location");
          }}
        >
          <IonLabel>Location</IonLabel>
        </IonChip>
        <IonChip
          style={
            filter === "User"
              ? { backgroundColor: "lightgray", color: "black" }
              : {}
          }
          onClick={(e) => {
            setFilter("User");
          }}
        >
          <IonLabel>User</IonLabel>
        </IonChip>
        <IonChip
          style={
            filter === "Title"
              ? { backgroundColor: "lightgray", color: "black" }
              : {}
          }
          onClick={(e) => {
            setFilter("Title");
          }}
        >
          <IonLabel>Title</IonLabel>
        </IonChip>

        <IonGrid>
          <IonRow>
            {images.map((p: Image, id) => {
              return (
                <IonCol key={id} size="4">
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
          cssClass="my-pop-over"
          backdropDismiss={true}
          showBackdrop={false}
          isOpen={showPopup}
          onDidDismiss={(e) => setShowPopup(false)}
        >
          {popPic && <ExploreCard image={popPic} />}
        </IonPopover>
      </IonContent>
    </IonPage>
  );
};

export default Search;
