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
  IonTextarea,
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

interface ContainerProps {
  image: Image;
  setLoading?: Dispatch<SetStateAction<boolean>>;
}

const ExploreCard: React.FC<ContainerProps> = ({ image, setLoading }) => {
  const [likeNumber, setLikeNumber] = useState(0);
  const [likeIcon, setLikeIcon] = useState(heartOutline);
  const [likeColor, setLikeColor] = useState("dark");
  const [comment, setComment] = useState<any>("");
  const [commentText, setCommentText] = useState<any>("");
  const [flag, setFlag] = useState(false);

  const [comments, setComments] = useState<Array<String>>([]);
  const [lastComment, setLastComment] = useState<String>();

  const onCommentChange = useCallback((e) => setComment(e.detail?.value), []);
  const [showUser, setShowUser] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const user = useContext(UserContext);
  const [commentTrue, setCommentTrue] = useState<boolean>(false)
  const [userProfilModel, setuserProfilModel] = useState(false);
  const [showCommentsModal, setshowCommentsModal] = useState(false);

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
          setCommentTrue(true);
          setLastComment(commentsInCollection[len]);
        });
    })();
  }, [
    image.id,
    user?.uid,
    setCommentText,
    setLikeIcon,
    setLikeColor,
    setLikeNumber,
  ]);

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
      var username: string = "";
      await db
        .collection("users")
        .doc(user?.uid)
        .get()
        .then((documentSnapshot) => {
          username = documentSnapshot.data()?.username;
        });

      var mes = username + ": " + comment;

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
  }, []);

  const showUserProfil = useCallback(() => {
    setuserProfilModel(true);
  }, []);

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
        {commentTrue ? <IonItem>{lastComment}</IonItem> : false}

        <br />

        <IonText style={{ fontSize: "large" }}>{image.description}</IonText>
      </IonCardContent>

      <ShowUserProfil
        image={image}
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
