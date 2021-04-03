import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonItem, IonAvatar, IonImg, IonLabel, IonGrid, IonRow, IonCol, IonTextarea} from '@ionic/react';
import React, {useState} from "react";

const Tab3: React.FC = () => {

  type Item = {
    src: string;
    text: string;
  };

  const profileName: String = "Jonny Black";
  const bio: String = "Hier steht meine Biografie schön beschrieben...";

  const Item1: Item = {src: 'http://placekitten.com/g/200/300', text: 'Picture'};

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Profile</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonGrid>
          <IonRow>
            <IonCol>
              <IonItem>
                <IonAvatar slot="start" style={{height: "100px", width: "100px"}}>
                  <IonImg src={Item1.src} />
                </IonAvatar>
                <IonGrid>
                  <IonRow>
                    <IonCol style={{textAlign: "center"}}>14</IonCol>
                    <IonCol style={{textAlign: "center"}}>3</IonCol>
                  </IonRow>
                  <IonRow>
                    <IonCol style={{textAlign: "center"}}>Likes</IonCol>
                    <IonCol style={{textAlign: "center"}}>Beiträge</IonCol>
                  </IonRow>
                </IonGrid>
              </IonItem>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonItem>
                <IonGrid style={{paddingLeft: "0px"}}>
                  <IonRow>
                    <IonCol><IonLabel style={{fontSize: "20px"}}>{profileName}</IonLabel></IonCol>
                  </IonRow>
                  <IonRow>
                    <IonCol><IonLabel className="ion-text-wrap" style={{fontSize: "15px"}}>{bio}</IonLabel></IonCol>
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

export default Tab3;
