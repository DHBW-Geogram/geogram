import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonGrid,
  IonIcon,
  IonImg,
  IonInput,
  IonItem,
  IonLabel,
  IonPopover,
  IonText,
  IonTextarea,
  IonTitle,
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
import firebase from "firebase/app";
import { delikeFunction, likeFunction } from "../../hooks/like";
import ShowUserProfil from "../ShowUserProfil/ShowUserProfil";
import ShowComments from "../ShowComments/ShowComments";

import "./ExploreCard.css"

interface ContainerProps {
  image: Image;
  setLoading?: Dispatch<SetStateAction<boolean>>;
}

const ExploreCard: React.FC<ContainerProps> = ({ image, setLoading }) => {
  const [likeNumber, setLikeNumber] = useState(0);
  const [likeIcon, setLikeIcon] = useState(heartOutline);
  const [likeColor, setLikeColor] = useState("dark");
  const [comment, setComment] = useState<any>("");
  const [flag, setFlag] = useState(false);
  const [nameOfUser, setNameOfUser]= useState<string>("");

  const [lastComment, setLastComment] = useState<String>();
  const [userComment, setUserComment] = useState<String>("");

  const onCommentChange = useCallback((e) => setComment(e.detail?.value), []);
  const user = useContext(UserContext);
  const [commentTrue, setCommentTrue] = useState<boolean>(false);
  const [userProfilModel, setuserProfilModel] = useState(false);
  const [showCommentsModal, setshowCommentsModal] = useState(false);

  useEffect(() => {
    setNameOfUser(image.user);
        
    //likes    
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

    //set last comment
    (async () => {
      await db
        .collection("images")
        .doc(image.id)
        .get()
        .then(async (documentSnapshot) => {
          let commentsInCollection: string[] = documentSnapshot.data()?.comment;

          if (commentsInCollection === undefined) {
            return;
          }

          var len = commentsInCollection.length - 1;
          var last = commentsInCollection[len].split(":")[0];
          var s = commentsInCollection[len].substr(last.length + 1);

          await db
            .collection("users")
            .doc(last)
            .get()
            .then((documentSnapshot) => {
              setUserComment(documentSnapshot.data()?.username + ":");
            });

          setCommentTrue(true);
          setLastComment(s);
        });
    })();
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

  //save comment on click in db
  const onAddCommentClick = useCallback(async () => {
    if (comment === "") {
      return;
    } else {
      var mes = user?.uid + ": " + comment;

      await db
        .collection("images")
        .doc(image.id)
        .update({
          comment: firebase.firestore.FieldValue.arrayUnion(mes),
        })
        .catch((err) => presentAlert(err.message));

      setComment("");
    }
  }, [user, image, comment]);

  const onReadCommentClick = useCallback(() => {    
    setshowCommentsModal(true);
  }, [true, setshowCommentsModal]);

  const showUserProfil = useCallback(() => {
    setNameOfUser(image.user);    
    setuserProfilModel(true);
  }, [image.user, setNameOfUser, setuserProfilModel]);


  const onCommetShowUserProfilClick = useCallback(() => {   
    setNameOfUser(userComment?.split(":")[0])
    setuserProfilModel(false);
  },[setuserProfilModel, true, setNameOfUser, userComment] )

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

          <IonButton onClick={onReadCommentClick}>Read Comments</IonButton>
        </IonButtons>
        <IonItem>
          <IonTextarea
            placeholder="Comment"
            maxlength={160}
            rows={1}
            autoGrow={true}
            value={comment}
            inputmode="text"
            onIonChange={onCommentChange}
          ></IonTextarea>
          <IonButton
            style={{
              height: "80%",
            }}
            fill="clear"
            onClick={onAddCommentClick}
          >
            Add
          </IonButton>
        </IonItem>

        {commentTrue ? (
          <IonGrid>
            <IonInput onClick={onCommetShowUserProfilClick} disabled={false}>{userComment}</IonInput>

            <IonInput>{lastComment}</IonInput>
          </IonGrid>
        ) : (
          false
        )}

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
        nameOfUser={nameOfUser}
        activeShowUserProfil={userProfilModel}
        setuserProfilModel={setuserProfilModel}
        setLoading={setLoading}
      />

      <ShowComments
        image={image}
        active={showCommentsModal}
        setshowCommentsModal={setshowCommentsModal}
        setLoading={setLoading}
      />
    </IonCard>
  );
};

export default ExploreCard;
