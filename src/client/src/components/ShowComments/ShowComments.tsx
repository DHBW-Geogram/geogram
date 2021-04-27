import {
  IonButton,
  IonButtons,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonModal,
  IonText,
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

import { Comment } from "../../model/Comment";
import firebase from "firebase/app";
import { UserContext } from "../..";
import ShowUserProfil from "../ShowUserProfil/ShowUserProfil";

import { v4 as uuidv4 } from "uuid";

import "./ShowComments.css";

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
  // const [comments, setComments] = useState<String[]>();
  const [userProfilModel, setuserProfilModel] = useState(false);
  const [nameOfUser, setNameOfUser] = useState<string>("");

  const [comments, setComments] = useState<Array<Comment>>([]);

  const user = useContext(UserContext);

  useEffect(() => {
    db.collection("images")
      .doc(image.id)
      .get()
      .then(async (documentSnapshot) => {
        let c: Comment[] = [];

        if (documentSnapshot.data()?.comments === undefined) {
          return;
        } else {
          documentSnapshot.data()?.comments.forEach((e: any) => {
            c.push(e.comments);
          });
        }
        setComments(c);
      });
    // }, [image, user, image.id, db]);
  });

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

  const closeModal = useCallback(() => {
    setshowCommentsModal(false);
  }, [false, setshowCommentsModal]);

  const onClickShowUserProfil = useCallback(
    async (userName: string) => {
      setNameOfUser(userName);
      setuserProfilModel(true);
    },
    [setuserProfilModel, true, setNameOfUser]
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
        {comments?.map((comment) => {
          return (
            <IonGrid key={comment.comments.commentId}>
              <IonText
                // onClick={async () =>
                // await onClickShowUserProfil(comment.split(":")[0])
                // }
                color="primary"
              >
                {comment.comments.userid}
                {comment.comments.commentTimestamp}
              </IonText>
              <br />
              <IonText>{comment.comments.comment}</IonText>
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
    </IonModal>
  );
};

export default ShowComments;
