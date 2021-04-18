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
import { User } from "../../model/User";

import firebase from "firebase/app";
import { delikeFunction, likeFunction } from "../../hooks/like";

interface ContainerProps {
  image: Image;
}

const ExploreCard: React.FC<ContainerProps> = ({ image }) => {
  const [likeNumber, setLikeNumber] = useState(Number);
  const [likeIcon, setLikeIcon] = useState(heartOutline);
  const [liked, setLiked] = useState(false);

  const user = useContext(UserContext);

  useEffect(() => {
    db.collection("images")
      .where("id", "==", image.id)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach(async (doc) => {
          //if picture was never liked or like equals zero
          if (doc?.data()?.likes === undefined || doc?.data()?.likes === 0) {
            await db
              .collection("users")
              .doc(user?.uid)
              .update({
                likedImage: ["initialString"],
              })
              .catch((err) => presentAlert(err.message));
            return;
          }
          //if image was liked set likes and for spezific user the icon
          else {
            //set the like number
            setLikeNumber(doc.data().likes);

            //check if user liked the image if true set spezific icon
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
                documentSnapshot
                  .data()
                  ?.likedImage.forEach(async (userLikedImage: any) => {
                    console.log(userLikedImage);

                    if (userLikedImage === image.id) {
                      setLikeIcon(heart);
                    }
                  });
              });
          }
        });
      });
  });

  const onLikeClick = useCallback(async () => {
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

        documentSnapshot
          .data()
          ?.likedImage.forEach(async (userLikedImage: any) => {
            console.log(userLikedImage);

            //if true delike
            if (userLikedImage === image.id) {
              console.log("delike");
              var like = await delikeFunction(user, likeNumber, image);

              setLikeNumber(like);
              setLikeIcon(heartOutline);
            }
            //else like
            else {
              console.log("like");
              if (likeNumber === undefined) {
                setLikeNumber(0);
              }

              var like = await likeFunction(user, likeNumber, image);

              setLikeNumber(like);
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
          <IonButton color="dark" onClick={onLikeClick}>
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
