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
import { heartOutline, pin, heart } from "ionicons/icons";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { UserContext } from "../..";
import { auth, db } from "../../helper/firebase";
import { presentAlert } from "../../hooks/alert";
import { Image } from "../../model/Image";
import { User } from "../../model/User";

interface ContainerProps {
  image: Image;
  
}
    

const ExploreCard: React.FC<ContainerProps> = ({ image }) => {

  const [likeNumber, setLikeNumber] = useState(Number);
  const [likeIcon, setLikeIcon] = useState(heartOutline);
  const [liked, setLiked] = useState(false);

  const userContext = useContext(UserContext);

  useEffect(() => {
    db.collection("images")
      .where("id", "==", image.id)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach(async (doc) => {
          if (doc?.data()?.likes === undefined) {
            return;
          } else {
            setLikeNumber(doc.data().likes);

            //Muss User abhängig gemacht werden
            setLikeIcon(heart);

          }
        });
      });
  });

  const onLikeClick = useCallback(async () => {

    // db.collection("users")
    // .doc(userContext?.uid)   
    // .get()
    // .then(() => {
    //   });

      // if(likedImage === undefined){
      //   await db
      //   .collection("users")
      //   .doc(userContext?.uid)
      //   .get()
      //   .then((data) =>
      //     db
      //       .collection("users") 
      //       .doc(userContext?.uid)
      //       .set(
      //         {
      //           ...data.data(),
      //           likedImage: [image.id],
      //         },
      //         { merge: true }
      //       )
      //       .catch((err) => presentAlert(err.message))
      //   ).catch((err) => presentAlert(err.message));
      // }else {

      // }


    

   
    if (likeNumber === undefined) {
      setLikeNumber(0);
    }

    var like = likeNumber;

    like += 1;

    await db
      .collection("images")
      .doc(image.id)
      .get()
      .then((data) =>
        db
          .collection("images")
          .doc(image.id)
          .set(
            {
              ...data.data(),
              likes: like,
            },
            { merge: true }
          )
      )
      .catch((err) => presentAlert(err.message));

    setLikeNumber(like);
    setLikeIcon(heart);

  }, [likeNumber]);

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
