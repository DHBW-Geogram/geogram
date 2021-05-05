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
  IonModal,
} from "@ionic/react";
import { db } from "../../helper/firebase";
import { Image } from "../../model/Image";
import { GeolocationPosition, Plugins } from "@capacitor/core";
import { distanceInKm } from "../../hooks/evaluateDistance";
import ExploreCard from "../../components/ExploreCard/ExploreCard";
import "./Search.css";
import { fetchImages } from "../../hooks/fetchImages";

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
      Geolocation.getCurrentPosition().then((s) => {
        setLocation(s);

        console.log("serach ");

        fetchImages(s).then((images) => {
          setImages(images);
        });
      });
    })();
  }, [GeolocationPositionError]);

  // async function fetchImages(l?: any): Promise<Image[]> {
  //   // fetch images from firebase
  //   const ref = db.collection("images");
  //   const data = await ref.get();

  //   // load images to typed docs
  //   let t: Image[] = [];
  //   data.docs.forEach((doc: any) => t.push(doc.data()));
  //   t.forEach((element: Image) => {
  //     if (l !== undefined && element.distance === undefined) {
  //       element.distance = distanceInKm(
  //         l?.coords.latitude,
  //         l?.coords.longitude,
  //         element.location.coords.latitude,
  //         element.location.coords.longitude
  //       );
  //     }
  //   });

  //   return t;
  // }

  function filterItems(searchText: string) {
    searchText = searchText.toLowerCase();
    console.log("filtering", searchText);
    if (searchText.length <= 3) {
      return;
    }

    if (searchText === "" || searchText === null || searchText === undefined) {
      fetchImages(location).then((res) => {
        setImages(res);
      });
    } else if (filter === "Location") {
      fetchImages(location).then((res) => {
        let i: Image[] = [];
        res.forEach((image) => {
          if (image.location.position?.includes(searchText)) {
            i.push(image);
          }
        });
        setImages(i);
      });
    } else if (filter === "Title") {
      fetchImages(location).then((res) => {
        let i: Image[] = [];
        res.forEach((image) => {
          if (image.title.includes(searchText)) {
            i.push(image);
          }
        });
        setImages(i);
      });
    } else if (filter === "User") {
      fetchImages(location).then((res) => {
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
            {images.map((p: Image, i: number) => {
              return (
                <IonCol size="4" key={i}>
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
                      color: "white",
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

        <IonModal
          cssClass="my-pop-over"
          isOpen={showPopup}
          showBackdrop={true}
          onWillDismiss={(e) => setShowPopup(false)}
        >
          <IonContent>{popPic && <ExploreCard image={popPic} />}</IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default Search;
