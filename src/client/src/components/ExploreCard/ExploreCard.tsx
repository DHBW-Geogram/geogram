import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonGrid,
  IonIcon,
  IonImg,
  IonItem,
  IonLabel,
  IonPopover,
  IonRouterOutlet,
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
import { v4 as uuidv4 } from "uuid";
import "./ExploreCard.css";

import { Route, Router } from "workbox-routing";
import Profile from "../../pages/Profile/Profile";
import { IonReactRouter } from "@ionic/react-router";
import ProfilePicSelectionModal from "../ProfilePicSelectionModal/ProfilePicSelectionModal";
import { render } from "react-dom";

import { Redirect } from "react-router";
import { canConstructReadableStream } from "workbox-core/_private";
import { timeConverter } from "../../hooks/timeConverter";

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
  const [nameOfUser, setNameOfUser] = useState<string>("");

  const [lastComment, setLastComment] = useState<String>();
  const [userComment, setUserComment] = useState<String>("");

  const onCommentChange = useCallback((e) => setComment(e.detail?.value), []);
  const user = useContext(UserContext);
  const [commentTrue, setCommentTrue] = useState<boolean>(false);
  const [redirect, setRedirect] = useState("");

  const [userProfilModel, setuserProfilModel] = useState(false);
  const [showCommentsModal, setshowCommentsModal] = useState(false);

  const [comments, setComments] = useState<any[]>([]);

  useEffect(() => {
    db.collection("images")
      .doc(image.id)
      .get()
      .then(async (documentSnapshot) => {
        //if image have no likes -> return
        if (
          documentSnapshot.data()?.likes === undefined ||
          documentSnapshot.data()?.likes === 0
        ) {
          return;
        }
        //image have likes
        else {
          await db
            .collection("users")
            .doc(user?.uid)
            .get()
            .then(async (documentSnapshot) => {
              // speichere die vom User geliketen bilder in  "likedImages"
              let likedImages: string[] = documentSnapshot.data()?.likedImage;

              let bol: boolean = false;

              //hat der user bilder geliket suche das aktuelle bild in dem array
              // ist es vorhanden -> setzte bol auf true
              if (likedImages !== undefined) {
                bol = likedImages.find((i) => i === image.id) !== undefined;
              }
              //if bol = true setze das icon heart und die farbe danger
              if (bol) {
                setLikeIcon(heart);
                setLikeColor("danger");
              } else {
                setLikeIcon(heartOutline);
                setLikeColor("dark");
              }
            });
        }
        //in alle Fälle setzte die anzahl an likes
        setLikeNumber(await documentSnapshot.data()?.likes);

        //set last Comment
        (async () => {
          // alle user holen
          let users: any[] = [];
          const ref = db.collection("users");
          const data = await ref.get();

          data.docs.forEach((doc: any) =>
            users.push([doc.data().username, doc.id])
          );

          //  image.comments?.filter((c: any) => c.timestamp )
          var temp = 0;
          image.comments?.forEach((cc: any) => {
            if (cc.timestamp >= temp) {
              temp = cc.timestamp;
            }
          });

          const t = image.comments?.filter((f: any) => f.timestamp === temp);

          if (t !== undefined)
            t.map((t: any) => {
              let name: string = "";

              for (var i = 0; i < users.length; i++) {
                if (users[i][1] === t.userid) {
                  name = users[i][0];
                }
              }
              setComments((pstate: any) => {
                return [
                  ...pstate,
                  {
                    ...t,
                    userid: name,
                  },
                ];
              });
            });
        })();
        /*** */
      });
  }, [image, user]);

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
      await db
        .collection("images")
        .doc(image.id)
        .update({
          comments: firebase.firestore.FieldValue.arrayUnion({
            comment: comment,
            userid: user?.uid,
            timestamp: Date.now(),
            id: uuidv4(),
          }),
        })
        .catch((err) => presentAlert(err.message));

      setComment("");
    }
  }, [user, image, comment]);

  const onReadCommentClick = useCallback(() => {
    setshowCommentsModal(true);
  }, [true, setshowCommentsModal]);

  // const onCommetShowUserProfilClick = useCallback(
  //   async (username: any) => {
  //     await db
  //       .collection("users")
  //       .where("username", "==", username)
  //       .get()
  //       .then(async (querySnapshot) => {
  //         querySnapshot.forEach(async (doc) => {
  //           if (doc.id === user?.uid) {
  //             setRedirect("profile");
  //             return;
  //           } else {
  //             setNameOfUser(username);
  //             setuserProfilModel(true);
  //           }
  //         });
  //       });
  //   },
  //   [image]
  // );

  const showUserProfil = useCallback(
    async (username: any) => {
      await db
        .collection("users")
        .where("username", "==", username)
        .get()
        .then(async (querySnapshot) => {
          querySnapshot.forEach(async (doc) => {
            if (doc.id === user?.uid) {
              setRedirect("profile");
              return;
            } else {
              setNameOfUser(username);
              setuserProfilModel(true);
            }
          });
        });
    },
    [image]
  );

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
        <IonCardSubtitle onClick={async () => await showUserProfil(image.user)}>
          {image.user}
        </IonCardSubtitle>
        <IonCardTitle
          onClick={() => {
            let descriptionElement: any = document.getElementById(
              `${image.id}-2`
            );
            if (descriptionElement.classList.length > 0) {
              descriptionElement.classList.remove("hide-text-overflow");
            } else {
              descriptionElement.classList.add("hide-text-overflow");
            }
          }}
        >
          <h2
            style={{ fontSize: "1.3rem" }}
            id={`${image.id}-2`}
            className="hide-text-overflow"
          >
            {image.title}
          </h2>
        </IonCardTitle>
      </IonCardHeader>

      <IonCardContent>
        <IonImg src={image.url}></IonImg>

        <IonItem lines="none">
          <IonButton fill="clear" color={likeColor} onClick={onLikeClick}>
            <IonIcon icon={likeIcon} />
          </IonButton>
          <IonText> {likeNumber}</IonText>

          <IonButton slot="end" fill="clear" onClick={onReadCommentClick}>
            Read Comments
          </IonButton>
        </IonItem>

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

        <br />

        <IonText
          onClick={() => {
            let descriptionElement: any = document.getElementById(
              `${image.id}-1`
            );
            if (descriptionElement.classList.length > 0) {
              descriptionElement.classList.remove("hide-text-overflow");
            } else {
              descriptionElement.classList.add("hide-text-overflow");
            }
          }}
          style={{ fontSize: "large" }}
        >
          <p id={`${image.id}-1`} className="hide-text-overflow">
            {image.description}
          </p>
        </IonText>

        <br />

        {/* {commentTrue ? ( */}

        {comments &&
          comments.map((c) => {
            var time = timeConverter(c.timestamp);

            return (
              <IonGrid key={c.id}>
                <IonText
                  color="primary"
                  onClick={async () => await showUserProfil(c.userid)}
                >
                  {c.userid} {time}
                </IonText>
                <IonText>
                  <p className="hide-text-overflow">{c.comment}</p>
                </IonText>
              </IonGrid>
            );
          })}
        {/* ) : (
          false
        )} */}
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

      {redirect !== "" && <Redirect to={`/${redirect}`}></Redirect>}
    </IonCard>
  );
};

export default ExploreCard;
