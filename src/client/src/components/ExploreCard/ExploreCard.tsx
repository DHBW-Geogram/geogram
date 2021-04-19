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
  IonInput,
  IonItem,
  IonLabel,
  IonText,
} from "@ionic/react";
import { heartOutline, pin, heart, bookmarkOutline } from "ionicons/icons";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { UserContext } from "../..";
import { auth, db, fb } from "../../helper/firebase";
import { presentAlert } from "../../hooks/alert";
import { Image } from "../../model/Image";

import { delikeFunction, likeFunction } from "../../hooks/like";

interface ContainerProps {
  image: Image;
}

const ExploreCard: React.FC<ContainerProps> = ({ image }) => {
  const [likeNumber, setLikeNumber] = useState(Number);
  const [likeIcon, setLikeIcon] = useState(heartOutline);
  const [likeColor, setLikeColor] = useState("dark");

  const user = useContext(UserContext);

  useEffect(() => {
    db.collection("images")
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
              if (
                documentSnapshot.data()?.likedImage === undefined ||
                documentSnapshot.data()?.likedImage.length < 1
              ) {
                await db
                  .collection("users")
                  .doc(user?.uid)
                  .update({
                    likedImage: ["initialString"],
                  })
                  .catch((err) => presentAlert(err.message));
              }
            });

          await db
            .collection("users")
            .doc(user?.uid)
            .get()
            .then(async (documentSnapshot) => {
              documentSnapshot
                .data()
                ?.likedImage.forEach(async (userLikedImage: any) => {
                  if (userLikedImage === image.id) {
                    setLikeIcon(heart);
                    setLikeColor("danger");
                  }
                });
            });
          setLikeNumber(documentSnapshot.data()?.likes);
        }
      });
  });

  const onLikeClick = useCallback(async () => {
    // check if liekdImage Arr in users are undifined or empty then set "initialString"
    await db
      .collection("users")
      .doc(user?.uid)
      .get()
      .then(async (documentSnapshot) => {
        if (
          documentSnapshot.data()?.likedImage === undefined ||
          documentSnapshot.data()?.likedImage.length < 1
        ) {
          await db
            .collection("users")
            .doc(user?.uid)
            .update({
              likedImage: ["initialString"],
            })
            .catch((err) => presentAlert(err.message));
        }
      });

    await db
      .collection("users")
      .doc(user?.uid)
      .get()
      .then(async (documentSnapshot) => {
        documentSnapshot
          .data()
          ?.likedImage.forEach(async (userLikedImage: any) => {
            //if true delike
            if (userLikedImage === image.id) {
              var like = await delikeFunction(user, likeNumber, image);

              setLikeNumber(like);
              setLikeColor("dark");
              setLikeIcon(heartOutline);
            }
            //else like
            else {
              if (likeNumber === undefined) {
                setLikeNumber(0);
              }

              var like = await likeFunction(user, likeNumber, image);

              setLikeNumber(like);
              setLikeColor("danger");
              setLikeIcon(heart);
            }
          });
      })
      .catch((err) => presentAlert(err.message));
  }, [likeNumber, image, user, db]);

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
        <IonCardSubtitle>{image.user}</IonCardSubtitle>
        <IonCardTitle>{image.title}</IonCardTitle>
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
        <IonText style={{ fontSize: "large" }}>{image.description}</IonText>
      </IonCardContent>
    </IonCard>
  );
};

export default ExploreCard;
