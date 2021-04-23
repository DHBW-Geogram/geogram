import {
  IonButton,
  IonButtons,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonItem,
  IonModal,
  IonTextarea,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { chevronBackOutline } from "ionicons/icons";
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
import "./ShowComments.css";

import firebase from "firebase/app";
import { UserContext } from "../..";

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

  // const [comments, setComments] = useState<Image[]>([]);
  const [comments, setComments] = useState<String[]>();

  const user = useContext(UserContext);

  useEffect(() => {
    (async () => {
      await db
        .collection("images")
        .doc(image.id)
        .get()
        .then(async (documentSnapshot) => {
          let commentsInCollection: string[] = documentSnapshot.data()?.comment;

          setComments(await documentSnapshot.data()?.comment);

          if (commentsInCollection === undefined) {
            return;
          }

          setComments(commentsInCollection);
        });
    })();
  }, [image]);

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

  const closeModal = useCallback(() => {
    setshowCommentsModal(false);
  }, [false, setshowCommentsModal]);

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
      </div>

      <IonContent>
      
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

        
        {comments?.map((comment) => {
          return (
            <IonItem>
              <IonTextarea rows={1} autoGrow={true} disabled={true}>
                {comment}
              </IonTextarea>
            </IonItem>
          );
        })}
      </IonContent>
    </IonModal>
  );
};

export default ShowComments;
