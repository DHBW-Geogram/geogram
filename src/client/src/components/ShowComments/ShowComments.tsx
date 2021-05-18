import {
  IonButton,
  IonContent,
  IonGrid,
  IonItem,
  IonModal,
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
import { Image } from "../../model/Image";
import { Comment } from "../../model/Comment";

import { UserContext } from "../..";
import ShowUserProfil from "../ShowUserProfil/ShowUserProfil";
import { v4 as uuidv4 } from "uuid";

import "./ShowComments.css";
import { timeConverter } from "../../hooks/timeConverter";
import { Redirect } from "react-router";
import { saveComments } from "../../hooks/saveComments";

interface ContainerProps {
  image: Image;
  active: boolean;
  setshowCommentsModal: Dispatch<SetStateAction<boolean>>;
  setLoading?: Dispatch<SetStateAction<boolean>>;
  tempComment: number;
  setTempComment: Dispatch<SetStateAction<number>>;
}

const ShowComments: React.FC<ContainerProps> = ({
  image,
  active,
  setshowCommentsModal,
  setLoading,
  tempComment,
  setTempComment,
}) => {
  const onCommentChange = useCallback((e) => setComment(e.detail?.value), []);
  const [comment, setComment] = useState<any>("");
  const [userProfilModel, setuserProfilModel] = useState(false);
  const [nameOfUser, setNameOfUser] = useState<string>("");
  const [comments, setComments] = useState<any[] | undefined>([]);

  const [redirect, setRedirect] = useState("");

  const user = useContext(UserContext);

  useEffect(() => {
    if (tempComment === 2) {
      console.log("useeffect - ShowComments");
      setComments([]);
      setCommentsInModal();
    }
  }, [tempComment, nameOfUser, image.likes]);

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
      let commentData: any[] = [];

      commentData.push({
        comment: comment,
        userid: user?.uid,
        timestamp: Date.now(),
        id: uuidv4(),
      });

      //call methode to save the Comment in firebase
      saveComments(image.id, commentData);

      //set InputField empty
      setComment("");

      //show all comments
      await setCommentsInModal();

      //Loading false
      if (setLoading != undefined) setLoading(false);
    }
  }, [comment]);

  const closeModal = useCallback(() => {
    if (setLoading !== undefined) setLoading(true);
    setTempComment(1);

    setshowCommentsModal(false);
  }, []);

  const onClickShowUserProfil = useCallback(
    async (username: any) => {
      setTempComment(3);
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
    <IonModal
      isOpen={active}
      cssClass="modalComment"
      onWillDismiss={() => {
        if (setLoading !== undefined) setLoading(true);
        setTempComment(1);
        setshowCommentsModal(false);
      }}
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
            autoGrow={false}
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
      </IonContent>

      <ShowUserProfil
        nameOfUser={nameOfUser}
        activeShowUserProfil={userProfilModel}
        setuserProfilModel={setuserProfilModel}
        setLoading={setLoading}
        tempComment={tempComment}
        setTempComment={setTempComment}
      />

      {redirect !== "" && <Redirect to={`/${redirect}`}></Redirect>}
    </IonModal>
  );
};

export default ShowComments;
