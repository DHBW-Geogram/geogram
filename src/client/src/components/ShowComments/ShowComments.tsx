import {
  IonButton,
  IonContent,
  IonGrid,
  IonItem,
  IonModal,
  IonText,
  IonTextarea,
} from "@ionic/react";
import { arrowBack, chevronBackOutline } from "ionicons/icons";
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
import { timeConverter } from "../../hooks/timeConverter";
import { UsernameAndId } from "../../model/UsernameAndId";

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

  const user = useContext(UserContext);

  useEffect(() => {

    (async() => {
    // alle user holen
    let users: any[] = [];
    const ref = db.collection("users");
    const data = await ref.get();

     data.docs.forEach((doc: any) => users.push([doc.data().username, doc.id]))


     // image.comments durchiterrieren
     image.comments?.map((c: any) => {
       // it c.userid user in array suchen
       let name: string = "";

       // name = users.find((u: any) => u.id  === c.userid);

       for(var i = 0; i < users.length; i++){      
         if(users[i][1] === c.userid){
           name = users[i][0]
           console.log(name)
         }
       }

     setComments((pstate: any) => {
       return [...pstate,
         {
           ...c,
           userid: name,
         },
       ];
     });

     });
  })()
  }, [image]);

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
        {comments &&
          comments.map((c) => {
            //.filter

    //         var a = new Date(c.timestamp);    
    //  var monthsNummeric = ['01','02','03','04','05','06','07','08','09','10','11','12'];
    // var year = a.getFullYear();
    // var month = monthsNummeric[a.getMonth()];
    // var date = a.getDate();
    // var hour = a.getHours();
    // var min = a.getMinutes();
   

    // var time = "- "+ date + '.' + month + '.' + year + ' ' + hour + ':' + min;

          var time = timeConverter(c.timestamp);


            return (
              <IonGrid key={c.id}>
                <IonText
                   onClick={async () =>
                     await onClickShowUserProfil(c.userid)
                   }
                  color="primary"
                >
                  {c.userid} 
                  {" "}
                  
                  {time}
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
    </IonModal>
  );
};

export default ShowComments;
