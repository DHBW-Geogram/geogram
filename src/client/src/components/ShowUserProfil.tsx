import {
  IonAvatar,
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonImg,
  IonItem,
  IonLabel,
  IonPage,
  IonRow,
  IonTitle,
  IonToolbar,
  useIonToast,
} from "@ionic/react";
import { chevronBackOutline, image } from "ionicons/icons";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Image } from "../model/Image";
import { db } from "../helper/firebase";


interface ContainerProps {
  image: Image;  
}

const ShowUserProfil: React.FC<ContainerProps> = ({image}) => {

  const [username, setUsername] = useState<string>();
  const [firstName, setFirstName] = useState<string>();
  const [lastName, setLastName] = useState<string>();
  const [fullName, setFullName] = useState<string>();

  const [bio, setBio] = useState<string>();
  const [profilepic, setProfilepic] = useState(
    "https://im-coder.com/images4/15590312779219.png"
  );

  const [posts, setPosts] = useState<number>(0);

  useEffect(() => {
    db.collection("users")
      .where("username", "==", image.user)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          if (doc.data().profilepic != null) {
            setProfilepic(doc.data().profilepic);
          }
          setUsername(doc.data().username);
          setFirstName(doc.data().userFirstName);
          setLastName(doc.data().userLastName);
          setBio(doc.data().biography);
          setFullName(doc.data().userFirstName + " " + doc.data().userLastName);
        });
      });
  }, []);

    

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton color="primary" routerLink="/explore">
              <IonIcon icon={chevronBackOutline} />
            </IonButton>
          </IonButtons>
          <IonTitle>{username}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonGrid>
          <IonRow>
            <IonCol>
              <IonItem>
                <IonAvatar
                  slot="start"
                  style={{ height: "100px", width: "100px" }}                  
                >
                  <IonImg src={profilepic} />
                </IonAvatar>

                <IonGrid>
                  <IonRow>
                    <IonCol style={{ textAlign: "center" }}>-</IonCol>
                    <IonCol style={{ textAlign: "center" }}>{posts}</IonCol>
                  </IonRow>
                  <IonRow>
                    <IonCol style={{ textAlign: "center" }}>Likes</IonCol>
                    <IonCol style={{ textAlign: "center" }}>Beiträge</IonCol>
                  </IonRow>
                </IonGrid>
              </IonItem>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonItem>
                <IonGrid style={{ paddingLeft: "0px" }}>
                  <IonRow>
                    <IonCol>
                      <IonLabel style={{ fontSize: "20px" }}>
                        {fullName}
                      </IonLabel>
                    </IonCol>
                  </IonRow>
                  <IonRow>
                    <IonCol>
                      <IonLabel
                        className="ion-text-wrap"
                        style={{ fontSize: "15px" }}
                      >
                        {bio}
                      </IonLabel>
                    </IonCol>
                  </IonRow>
                </IonGrid>
              </IonItem>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default ShowUserProfil;
