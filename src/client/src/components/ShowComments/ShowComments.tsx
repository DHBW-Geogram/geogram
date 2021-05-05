import {
  IonButton,
  IonContent,
  IonGrid,
  IonItem,
  IonModal,
  IonRefresher,
  IonRefresherContent,
  IonText,
  IonTextarea,
} from "@ionic/react";
import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { db } from "../../helper/firebase";
import { presentAlert } from "../../hooks/alert";
import { Image } from "../../model/Image";
import { Comment } from "../../model/Comment";

import firebase from "firebase/app";
import { UserContext } from "../..";
import ShowUserProfil from "../ShowUserProfil/ShowUserProfil";

import { RefresherEventDetail } from "@ionic/core";
import { v4 as uuidv4 } from "uuid";

import "./ShowComments.css";
import { timeConverter } from "../../hooks/timeConverter";
import { Redirect } from "react-router";

interface ContainerProps {
  image: Image;
  active: boolean;
  setshowCommentsModal: Dispatch<SetStateAction<boolean>>;
  setLoading?: Dispatch<SetStateAction<boolean>>;
  temp: number; 
  setTemp: Dispatch<SetStateAction<number>>;
}

const ShowComments: React.FC<ContainerProps> = ({
  image,
  active,
  setshowCommentsModal,
  setLoading,
  temp,
  setTemp,
}) => {
  const onCommentChange = useCallback((e) => setComment(e.detail?.value), []);
  const [comment, setComment] = useState<any>("");
  const [userProfilModel, setuserProfilModel] = useState(false);
  const [nameOfUser, setNameOfUser] = useState<string>("");
  const [comments, setComments] = useState<any[] | undefined>([]);

  const [redirect, setRedirect] = useState("");

  const user = useContext(UserContext);

  useEffect(() => {
    console.log("useeffect - ShowComments");

    setCommentsInModal(); 

  }, [setComments, temp ]);

  function doRefresh(event: CustomEvent<RefresherEventDetail>) {
    setComments([]);

    setCommentsInModal();

    setTimeout(() => {
      event.detail.complete();
    }, 2000);
  }

  //set comments
  const setCommentsInModal = useCallback(async () => {
    // alle user holen
    let users: any[] = [];
    const ref = db.collection("users");
    const data = await ref.get();

    data.docs.forEach((doc: any) => {
      users.push({ username: doc.data().username, id: doc.id });
    });

    const refImage = db.collection("images");

    let dataImage: Comment[] = [];

    dataImage = (await refImage.doc(image.id).get()).data()?.comments;

    //image.comments durchiterrieren
    if (dataImage !== undefined)
      dataImage.map((c: any) => {
        // it c.userid user in array suchen
        let name: string = "";

        // name = users.find((u: any) => u.id  === c.userid);

        name = users.find((e) => e.id === c.userid).username;

        let nn = undefined;
        nn = (ss: any) => [
          ...ss,
          {
            ...c,
            userid: name,
          },
        ];

        setComments(nn);
      });
  }, [comments]);

  const onAddCommentClick = useCallback(async () => {
    if (comment === "") {
      return;
    } else {
      //Loading
      if (setLoading != undefined) setLoading(true);

      //setComments empty
      setComments([]);
      //setComments
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

      //show all comments
      await setCommentsInModal();

      //Loading false
      if (setLoading != undefined) setLoading(false);
    }
  }, [comment]);

  const closeModal = useCallback(() => {
    setTemp(1)
    setshowCommentsModal(false);
  }, [false]);

  const onClickShowUserProfil = useCallback(
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
              //setshowCommentsModal(false)
            }
          });
        });
    },
    [image]
  );

  return (
    <IonModal
      isOpen={active}
      cssClass="modalComment"
      onWillDismiss={() => {setTemp(1); setshowCommentsModal(false)}}
    >
      <div className="closeButton">
        <IonButton fill="clear" color="primary" onClick={closeModal}>
          Close
        </IonButton>
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
      </div>

      <IonContent>
        {comments &&
          comments
            .sort((a, b) => b.timestamp - a.timestamp)
            .map((c, id) => {
              //.filter

              var time = timeConverter(c.timestamp);

              return (
                <IonGrid key={id}>
                  <IonText
                    onClick={async () => await onClickShowUserProfil(c.userid)}
                    color="primary"
                  >
                    {c.userid} {time}
                  </IonText>
                  <br />
                  <IonText>{c.comment}</IonText>
                </IonGrid>
              );
            })}

        <IonRefresher
          slot="fixed"
          onIonRefresh={doRefresh}
          pullFactor={0.5}
          pullMin={100}
          pullMax={200}
        >
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>
      </IonContent>

      <ShowUserProfil
        image={image}
        nameOfUser={nameOfUser}
        activeShowUserProfil={userProfilModel}
        setuserProfilModel={setuserProfilModel}
        setLoading={setLoading}
      />

      {redirect !== "" && <Redirect to={`/${redirect}`}></Redirect>}
    </IonModal>
  );
};

export default ShowComments;
