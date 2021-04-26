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
import "./ShowComments.css";

import firebase from "firebase/app";
import { UserContext } from "../..";
import ShowUserProfil from "../ShowUserProfil/ShowUserProfil";

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
  const [userComment, setUserComment] = useState<String>();
  const [comments, setComments] = useState<String[]>();
  const [userNameComments, setuserNameComments] = useState<String[]>();
  const [userProfilModel, setuserProfilModel] = useState(false);
  const [nameOfUser, setNameOfUser] = useState<string>("");
  const [commentLength, setCommentLength] = useState<number>();
  const user = useContext(UserContext);

  useEffect(() => {
    (async () => {
      await db
        .collection("images")
        .doc(image.id)
        .get()
        .then(async (documentSnapshot) => {
          let commentsInCollection: string[] = documentSnapshot.data()?.comment;

          // setComments(await documentSnapshot.data()?.comment);

          if (commentsInCollection === undefined) {
            return;
          }

          let a: String[] = [];

          commentsInCollection.forEach(async (s) => {
            var ss = s.split(":")[0];

            //a.push(s)

            await db
              .collection("users")
              .doc(ss)
              .get()
              .then(async (documentSnapshot) => {
                a.push(
                  (await documentSnapshot.data()?.username) +
                    ": " +
                    s.substr(ss.length + 2)
                );
              });
          });

          console.log(a);

          setComments(a);
        });
    })();
  }, [image, user, image.id, db]);

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
          // comment: [{comment: [mes, user?.uid]}],
          // , { merge: true }
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
        {comments?.map((comment, id) => {
          return (
            <IonGrid key={id}>
              <IonText
                onClick={async () => await onClickShowUserProfil(comment.split(":")[0])}
                color="primary"
              >
                {comment.split(":")[0] + ":"}
              </IonText>
              <br />
              <IonText>
                {comment.substr(comment.split(":")[0].length + 2)}
              </IonText>
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
