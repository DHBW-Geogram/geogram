import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonItem, IonAvatar, IonImg, IonLabel, IonGrid, IonRow, IonCol, IonButton, IonModal, IonButtons, IonInput, IonTextarea} from '@ionic/react';
import React, {useState} from "react";

const Tab3: React.FC = () => {

  type Item = {
    src: string;
    text: string;
  };

  const [EditProfile, setEditProfile] = useState<boolean>(false);
  const [birthday, setbirthday] = useState<string>();
  const [username, setUsername] = useState<string>("Jonny Black");
  const [email, setEmail] = useState<string>();
  const[bio, setBio] = useState<string>("Hier steht meine Biografie schön beschrieben...");

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
                    <IonCol><IonLabel style={{fontSize: "20px"}}>{username}</IonLabel></IonCol>
                  </IonRow>
                  <IonRow>
                    <IonCol><IonLabel className="ion-text-wrap" style={{fontSize: "15px"}}>{bio}</IonLabel></IonCol>
                  </IonRow>
                </IonGrid>
              </IonItem>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol style={{textAlign: "center"}}>
              <IonButton shape="round" fill="outline" color="primary" onClick={ () => setEditProfile(true)}>Edit Profile</IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
        <IonModal isOpen={EditProfile}>
          <IonHeader>
            <IonToolbar>
              <IonButtons slot="end">
                <IonButton color="primary" onClick={ () => setEditProfile(false)}>Close</IonButton>
              </IonButtons>
              <IonTitle>Edit Profile</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent fullscreen>
            <IonItem>
              <IonLabel position="floating">Username</IonLabel>
              <IonInput value={username} type="text" onIonChange={e => setUsername(e.detail.value!)}></IonInput>
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Birthday</IonLabel>
              <IonInput value={birthday} type="date"></IonInput>
            </IonItem>
            <IonItem>
              <IonLabel position="floating">E-Mail</IonLabel>
              <IonInput value={email} type="email"></IonInput>
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Biography</IonLabel>
              <IonTextarea value={bio} onIonChange={e => setBio(e.detail.value!)}></IonTextarea>
            </IonItem>
            <IonGrid>
            <IonRow>
              <IonCol style={{textAlign: "center"}}>
                <IonButton expand="block" shape="round" fill="outline" color="primary" onClick={ () => setEditProfile(false)}>Cancel</IonButton>
              </IonCol>
              <IonCol style={{textAlign: "center"}}>
                <IonButton expand="block" shape="round" fill="outline" color="primary" onClick={ () => setEditProfile(false)}>Save</IonButton>
              </IonCol>
            </IonRow>
            </IonGrid>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default Tab3;
