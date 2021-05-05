import {
  IonAvatar,
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonImg,
  IonItem,
  IonLabel,
  IonModal,
  IonPage,
  IonPopover,
  IonRow,
  IonTitle,
  IonToolbar,
  useIonToast,
  useIonViewDidEnter,
  useIonViewDidLeave,
  useIonViewWillEnter,
  useIonViewWillLeave,
} from "@ionic/react";
import { chevronBackOutline, image } from "ionicons/icons";
import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { Image } from "../../model/Image";
import { auth, db } from "../../helper/firebase";
import "./ShowUserProfil.css";
import ExploreCard from "../ExploreCard/ExploreCard";

import { GeolocationPosition, Plugins } from "@capacitor/core";
import { distanceInKm } from "../../hooks/evaluateDistance";
import { fetchImages } from "../../hooks/fetchImages";

interface ContainerProps {
  nameOfUser: string;
  activeShowUserProfil: boolean;
  setuserProfilModel: Dispatch<SetStateAction<boolean>>;
  setLoading?: Dispatch<SetStateAction<boolean>>;
}

const { Geolocation } = Plugins;

const ShowUserProfil: React.FC<ContainerProps> = ({  
  nameOfUser,
  activeShowUserProfil,
  setuserProfilModel,
  setLoading,
}) => {
  const [username, setUsername] = useState<string>();
  const [firstName, setFirstName] = useState<string>();
  const [lastName, setLastName] = useState<string>();
  const [fullName, setFullName] = useState<string>();
  const [likes, setLikes] = useState<number>(0);
  // let postsUsername: string = "";
  let counterLikes: number = 0;

  const [bio, setBio] = useState<string>();
  const [popPic, setPopPic] = useState<Image>();
  const [showPopup, setShowPopup] = useState(false);

  const [location, setLocation] = useState<GeolocationPosition>();
  const [images, setImages] = useState<Array<Image>>([]);

  

  const [profilepic, setProfilepic] = useState(
    "https://im-coder.com/images4/15590312779219.png"
  );

  const [posts, setPosts] = useState<number>(0);


  //effect user profil information
  useEffect(() => {

    if (nameOfUser !== ""){
    console.log("useeffect - ShowUserProfil - profilInformation");

    db.collection("users")
      .where("username", "==", nameOfUser)
      .get()
      .then(async (querySnapshot) => {
        querySnapshot.forEach(async (doc) => {
          if ((await doc.data().profilepic) != null) {
            setProfilepic(doc.data().profilepic);
          }

          setFirstName(doc.data().userFirstName);
          setLastName(doc.data().userLastName);
          setBio(doc.data().biography);
          setFullName(doc.data().userFirstName + " " + doc.data().userLastName);
        });
      })
      .then(() => {
        db.collection("images")
          .where("user", "==", nameOfUser)
          .get()
          .then((querySnapshot) => {
            setPosts(querySnapshot.size);

            counterLikes = 0;

            querySnapshot.forEach((doc) => {
              if (!(doc.data().likes == null)) {
                counterLikes = counterLikes + doc.data().likes;
              }
            });
            setLikes(counterLikes);
          });
      });
    }
  },[nameOfUser]);

  //effect image from user
  useEffect(() => {    

    if (nameOfUser !== ""){
    console.log("useeffect - ShowUserProfil - userimage");
      //show images of user
      (async () => {
        // push location to state
        Geolocation.getCurrentPosition().then((s) => {
          setLocation(s);

          console.log("ShowUserProfil", nameOfUser);

          fetchImages(s, nameOfUser).then((images) => {
            setImages(images);
          });
        });
      })();
    }
  }, [nameOfUser, GeolocationPositionError]);

  const closeModal = useCallback(() => {
    setuserProfilModel(false);
  }, [setuserProfilModel]);

  return (
    <IonModal
      isOpen={activeShowUserProfil}
      cssClass="modal"
      onWillDismiss={() => setuserProfilModel(false)}
    >
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton color="primary" onClick={closeModal}>
              <IonIcon icon={chevronBackOutline} />
            </IonButton>
          </IonButtons>
          <IonTitle>{nameOfUser}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonGrid>
          <IonRow>
            <IonCol>
              <IonItem>
                <IonAvatar
                  slot="start"
                  style={{ height: "100px", width: "100px" }}
                >
                  <IonImg src={profilepic} />
                </IonAvatar>

                <IonGrid>
                  <IonRow>
                    <IonCol style={{ textAlign: "center" }}>{likes}</IonCol>
                    <IonCol style={{ textAlign: "center" }}>{posts}</IonCol>
                  </IonRow>
                  <IonRow>
                    <IonCol style={{ textAlign: "center" }}>Likes</IonCol>
                    <IonCol style={{ textAlign: "center" }}>Beiträge</IonCol>
                  </IonRow>
                </IonGrid>
              </IonItem>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonItem>
                <IonGrid style={{ paddingLeft: "0px" }}>
                  <IonRow>
                    <IonCol>
                      <IonLabel style={{ fontSize: "20px" }}>
                        {fullName}
                      </IonLabel>
                    </IonCol>
                  </IonRow>
                  <IonRow>
                    <IonCol>
                      <IonLabel
                        className="ion-text-wrap"
                        style={{ fontSize: "15px" }}
                      >
                        {bio}
                      </IonLabel>
                    </IonCol>
                  </IonRow>
                </IonGrid>
              </IonItem>
            </IonCol>
          </IonRow>
        </IonGrid>

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
                      // width: "100%",
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
      </IonContent>

      <IonModal
        cssClass="my-pop-over"
        showBackdrop={true}
        isOpen={showPopup}
        onWillDismiss={(e) => setShowPopup(false)}
      >
        <IonContent>{popPic && <ExploreCard image={popPic} />}</IonContent>
      </IonModal>
    </IonModal>
  );
};

export default ShowUserProfil;
