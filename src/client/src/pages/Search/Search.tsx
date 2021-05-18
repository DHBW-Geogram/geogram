import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
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
  IonModal,
  useIonViewWillEnter,
  useIonViewWillLeave,
} from "@ionic/react";
import { Image } from "../../model/Image";
import { GeolocationPosition, Plugins } from "@capacitor/core";
import ExploreCard from "../../components/ExploreCard/ExploreCard";
import "./Search.css";
import { fetchImages } from "../../hooks/fetchImages";

const { Geolocation } = Plugins;

const Search: React.FC<{
  temp: number;
  setTemp: Dispatch<SetStateAction<number>>;
}> = ({ setTemp, temp }) => {
  const [filter, setFilter] = useState("Location");
  const [images, setImages] = useState<Array<Image>>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [popPic, setPopPic] = useState<Image>();
  // Geoinformation
  const [location, setLocation] = useState<GeolocationPosition>();

  useIonViewWillEnter(() => {
    setTemp(2);
  }, [temp]);

  useIonViewWillLeave(() => {
    setTemp(20);
  }, [temp]);

  useEffect(() => {
    if (temp === 2) {
      (async () => {
        // push location to state
        Geolocation.getCurrentPosition().then((s) => {
          setLocation(s);

          fetchImages(s).then((images) => {
            setImages(images);
          });
        });
      })();
    }
  }, [temp, GeolocationPositionError]);

  function filterItems(searchText: string) {
    searchText = searchText.toLowerCase();
    console.log("filtering", searchText);
    if (searchText.length <= 3 && searchText.length >= 1) {
      return;
    }

    if (searchText === "" || searchText === null || searchText === undefined) {
      fetchImages(location).then((res) => {
        setImages(res);
      });
    } else if (filter === "Location") {
      fetchImages(location).then((res) => {
        console.log("Location", res);
        let i: Image[] = [];
        res.forEach((image) => {
          if (image.location.position?.toLowerCase().includes(searchText)) {
            i.push(image);
          }
        });
        setImages(i);
        console.log("i", i);
      });
    } else if (filter === "Title") {
      fetchImages(location).then((res) => {
        let i: Image[] = [];
        res.forEach((image) => {
          if (image.title.toLowerCase().includes(searchText)) {
            i.push(image);
          }
        });
        setImages(i);
      });
    } else if (filter === "User") {
      fetchImages(location).then((res) => {
        let i: Image[] = [];
        res.forEach((image) => {
          if (image.user.toLowerCase().includes(searchText)) {
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
