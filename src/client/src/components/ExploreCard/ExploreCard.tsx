import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonIcon,
  IonImg,
  IonItem,
  IonLabel,
  IonPopover,
  IonText,
} from "@ionic/react";
import { heartOutline, pin, heart } from "ionicons/icons";
import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { UserContext } from "../..";
import { db } from "../../helper/firebase";
import { presentAlert } from "../../hooks/alert";
import { Image } from "../../model/Image";

import { delikeFunction, likeFunction } from "../../hooks/like";
import ShowUserProfil from "../ShowUserProfil/ShowUserProfil";

import "./ExploreCard.css"

interface ContainerProps {
  image: Image;
  setLoading?: Dispatch<SetStateAction<boolean>>;
}

const ExploreCard: React.FC<ContainerProps> = ({ image, setLoading }) => {
  const [likeNumber, setLikeNumber] = useState(0);
  const [likeIcon, setLikeIcon] = useState(heartOutline);
  const [likeColor, setLikeColor] = useState("dark");
  const [flag, setFlag] = useState(false);
  const [showUser, setShowUser] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const user = useContext(UserContext);

  const [userProfilModel, setuserProfilModel] = useState(false);

  useEffect(() => {
    (async () => {
    await db.collection("images")
      .doc(image.id)
      .get()
      .then(async (documentSnapshot) => {
        if (documentSnapshot.data()?.likes === undefined) {
          return;
        } else {
          await db
            .collection("users")
            .doc(user?.uid)
            .get()
            .then(async (documentSnapshot) => {
              let likedImages: string[] = documentSnapshot.data()?.likedImage;

              let bol: boolean = false;
              if (likedImages !== undefined)
                bol = likedImages.find((i) => i === image.id) != undefined;

              //if true delike
              if (bol) {
                setLikeIcon(heart);
                setLikeColor("danger");
              }
            });
          setLikeNumber(documentSnapshot.data()?.likes);
        }
      });

    })();
  },[image.id, image, user, db, user?.uid, setLikeIcon, heart,"danger", "users", "images",  setLikeColor, setLikeNumber]);

  const onLikeClick = useCallback(async () => {
    if (flag === false) {
      setFlag(true);
      setTimeout(() => setFlag(false), 1000);

      if (setLoading != undefined) setLoading(true);

      await db
        .collection("users")
        .doc(user?.uid)
        .get()
        .then(async (documentSnapshot) => {
          let likedImages: string[] = documentSnapshot.data()?.likedImage;

          let bol: boolean = false;
          if (likedImages !== undefined)
            bol = likedImages.find((i) => i === image.id) != undefined;

          //if true delike
          if (bol) {
            var like = await delikeFunction(user, likeNumber, image);

            setLikeNumber(like);
            setLikeColor("dark");
            setLikeIcon(heartOutline);
          }
          //else like
          else {
            var like = await likeFunction(user, likeNumber, image);

            setLikeNumber(like);
            setLikeColor("danger");
            setLikeIcon(heart);
          }

          if (setLoading != undefined) setLoading(false);
        })
        .catch((err) => presentAlert(err.message));
    }
    if (setLoading != undefined) setLoading(false);
  }, [likeNumber, image, user, db, flag]);

  const showUserProfil = useCallback(() => {
    setuserProfilModel(true);
  }, [setuserProfilModel, true]);

  return (
    <IonCard className="my-ion-card">
      {/* Coordinated */}
      <IonItem>
        <IonIcon icon={pin} slot="start" />
        <IonLabel>
          {image.location.position
            ? image.location.position
            : image.location.coords.latitude +
              " " +
              image.location.coords.longitude}
        </IonLabel>
      </IonItem>

      {/* Distance */}
      {image.distance ? (
        <IonItem>
          <IonLabel>
            {`${image.distance.toString().slice(0, 4)} km away from you`}
          </IonLabel>
        </IonItem>
      ) : (
        <IonItem>
          <IonLabel>{`Near you`}</IonLabel>
        </IonItem>
      )}

      <IonCardHeader>
        <IonCardSubtitle onClick={showUserProfil}>{image.user}</IonCardSubtitle>
        <IonCardTitle onClick={() => {
          let descriptionElement: any = document.getElementById(`${image.id}-2`);
          if(descriptionElement.classList.length > 0){
            descriptionElement.classList.remove("hide-text-overflow");
          }else{
            descriptionElement.classList.add("hide-text-overflow")
          }
        }}><h2 style={{fontSize: "1.3rem"}} id={`${image.id}-2`} className="hide-text-overflow">{image.title}</h2></IonCardTitle>
      </IonCardHeader>

      <IonCardContent>
        <IonImg src={image.url}></IonImg>
        <br />
        <IonButtons slot="start">
          <IonButton color={likeColor} onClick={onLikeClick}>
            <IonIcon icon={likeIcon} />
          </IonButton>
          <IonText>{likeNumber}</IonText>
        </IonButtons>
        <br />
        <IonText onClick={() => {
          let descriptionElement: any = document.getElementById(`${image.id}-1`);
            if(descriptionElement.classList.length > 0){
              descriptionElement.classList.remove("hide-text-overflow");
            }else{
              descriptionElement.classList.add("hide-text-overflow")
            }
        }} style={{ fontSize: "large" }}><p id={`${image.id}-1`} className="hide-text-overflow">{image.description}</p></IonText>
      </IonCardContent>

      <ShowUserProfil
        image={image}
        active={userProfilModel}
        setuserProfilModel={setuserProfilModel}
        setLoading={setLoading}
      />
    </IonCard>
  );
};

export default ExploreCard;
