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
}

const ShowComments: React.FC<ContainerProps> = ({
  image,
  active,
  setshowCommentsModal,
  setLoading,
}) => {
  const onCommentChange = useCallback((e) => setComment(e.detail?.value), []);
  const [comment, setComment] = useState<any>("");
  const [userProfilModel, setuserProfilModel] = useState(false);
  const [nameOfUser, setNameOfUser] = useState<string>("");
  const [comments, setComments] = useState<any[]>([]);

  const [redirect, setRedirect] = useState("");

  const user = useContext(UserContext);

  useEffect(() => {
    console.log("useeffect - ShowComments");

    setCommentsInModal();

  }, []);

  function doRefresh(event: CustomEvent<RefresherEventDetail>) {
   
    setCommentsInModal();

    setTimeout(() => {     
      event.detail.complete();
    }, 2000);
  }
  // refresh comments
  // const doRefresh = useCallback(async (event: CustomEvent<RefresherEventDetail>) => {

  //   await setCommentsInModal();

  //   setTimeout(() => {
  //     event.detail.complete();
  //   }, 2000);

  // },[comments])

  //set comments
  const setCommentsInModal = useCallback(async () => {
    // alle user holen
    let users: any[] = [];
    const ref = db.collection("users");
    const data = await ref.get();

    data.docs.forEach((doc: any) => {
      users.push({ username: doc.data().username, id: doc.id });
    });

    // image.comments durchiterrieren
    image.comments?.map((c: any) => {
      // it c.userid user in array suchen
      let name: string = "";

      // name = users.find((u: any) => u.id  === c.userid);

      name = users.find((e) => e.id === c.userid).username;

      setComments((pstate: any) => {
        return [
          ...pstate,
          {
            ...c,
            userid: name,
          },
        ];
      });
    });
  }, [db, image, comments]);

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

    //await setCommentsInModal();

  }, [user, image, comment]);

  const closeModal = useCallback(() => {
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
      onWillDismiss={() => setshowCommentsModal(false)}
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
        <IonRefresher
          slot="fixed"
          onIonRefresh={doRefresh}
          pullFactor={0.5}
          pullMin={100}
          pullMax={200}
        >
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>

        {comments &&
          comments
            .sort((a, b) => b.timestamp - a.timestamp)
            .map((c) => {
              //.filter

              var time = timeConverter(c.timestamp);

              return (
                <IonGrid key={c.id}>
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
