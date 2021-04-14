import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonItem, IonAvatar, IonImg, IonLabel, IonGrid, IonRow, IonCol, IonButton, IonModal, IonButtons, IonInput, IonTextarea} from '@ionic/react';
import React, {useEffect, useState} from "react";
import { auth, db } from '../../helper/firebase';
import { checkUsername } from "./checkUsername";

const Profile: React.FC = () => {

  type Item = {
    src: string;
    text: string;
  };

  const [EditProfile, setEditProfile] = useState<boolean>(false);
  const [username, setUsername] = useState<string>();
  const [firstName, setFirstName] = useState<string>();
  const [lastName, setLastName] = useState<string>();
  const [email, setEmail] = useState<string>();
  const[bio, setBio] = useState<string>();

  const Item1: Item = {src: 'http://placekitten.com/g/200/300', text: 'Picture'};

  const [errorUsernameLabel, setErrorUsernameLabel] = useState<string>("");
  const [errorUsernameText, setErrorUsernameText] = useState<string>("");

  //const [isUsernameCorrect, setUsernameCorrect] = useState<boolean>(true);
  let isUsernameCorrect:boolean = true;

  const [errorEmailLabel, setErrorEmailLabel] = useState<string>("");
  const [errorEmailText, setErrorEmailText] = useState<string>("");

  const [isEmailCorrect, setEmailCorrect] = useState<boolean>(true);

  useEffect(() => {
    db.collection("users")
                  .where("email", "==", auth.currentUser?.email)
                  .get()
                  .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                      setUsername(doc.data().username);
                      setEmail(doc.data().email);
                      setFirstName(doc.data().userFirstName);
                      setLastName(doc.data().userLastName);
                      setBio(doc.data().biography);
                    })
                  });
  }, [EditProfile]);

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
                <IonButton color="primary" onClick={ () => {
                  setEditProfile(false);
                  setErrorEmailLabel("");
                  setErrorEmailText("");
                  setErrorUsernameLabel("");
                  setErrorUsernameText("");
                }}>Close</IonButton>
              </IonButtons>
              <IonTitle>Edit Profile</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent fullscreen>
            <IonItem>
              <IonLabel color={errorUsernameLabel} position="floating">Username</IonLabel>
              <IonInput color={errorUsernameText} value={username} type="text" onIonChange={async e => setUsername(e.detail.value!)}></IonInput>
            </IonItem>
            <IonItem>
              <IonLabel position="floating">First Name</IonLabel>
              <IonInput value={firstName} type="text" onIonChange={e => setFirstName(e.detail.value!)}></IonInput>
            </IonItem>
            <IonItem>
              <IonLabel position="floating">Last Name</IonLabel>
              <IonInput value={lastName} type="text" onIonChange={e => setLastName(e.detail.value!)}></IonInput>
            </IonItem>
            <IonItem>
              <IonLabel color={errorEmailLabel} position="floating">E-Mail</IonLabel>
              <IonInput color={errorEmailText} value={email} type="email" onIonChange={e => setEmail(e.detail.value!)}></IonInput>
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Biography</IonLabel>
              <IonTextarea value={bio} onIonChange={e => setBio(e.detail.value!)}></IonTextarea>
            </IonItem>
            <IonGrid>
            <IonRow>
              <IonCol style={{textAlign: "center"}}>
                <IonButton expand="block" shape="round" fill="outline" color="primary" onClick={ () => {
                  setEditProfile(false);
                  setErrorEmailLabel("");
                  setErrorEmailText("");
                  setErrorUsernameLabel("");
                  setErrorUsernameText("");
                }}>Cancel</IonButton>
              </IonCol>
              <IonCol style={{textAlign: "center"}}>
                <IonButton expand="block" shape="round" fill="outline" color="primary" onClick={ async () => {

                  isUsernameCorrect = true;
                  setEmailCorrect(true);

                  const data = {
                    username: username,
                    userFirstName: firstName,
                    userLastName: lastName,
                    email: email,
                    biography: bio
                  };

                  await checkUsername(username).then(async check => {

                  if(check)
                  {
                    setErrorUsernameLabel("danger");
                    setErrorUsernameText("danger");
                    isUsernameCorrect = false;
                  }
                  else
                  {
                    setErrorUsernameLabel("");
                    setErrorUsernameText("");
                    isUsernameCorrect = true;
                  }
                }).then(async () => {

                  if(email != await auth.currentUser?.email)
                  {
                    await auth.currentUser?.updateEmail(String(email)).then(async function(){
                      console.log("Email-Update successfull!");
                      setEmailCorrect(true);
                      await auth.currentUser?.sendEmailVerification().then(async function(){
                        console.log("Send Email successfull!");
                        setErrorEmailLabel("");
                        setErrorEmailText("");
                        if(isUsernameCorrect){
                          setErrorUsernameLabel("");
                          setErrorUsernameText("");
                          await db.collection("users").doc(auth.currentUser?.uid).set(data);
                          setEditProfile(false);
                        }
                      }).catch(function(error){
                        console.log("Send Email ERROR!");
                      });
                    }).catch(function(error){
                      console.log("Email-Update ERROR!");
                      setErrorEmailLabel("danger");
                      setErrorEmailText("danger");
                      setEmailCorrect(false);
                    });
                  }
                  else if(isUsernameCorrect)
                  {
                    setErrorUsernameLabel("");
                    setErrorUsernameText("");
                    setErrorEmailLabel("");
                    setErrorEmailText("");
                    await db.collection("users").doc(auth.currentUser?.uid).set(data);
                    setEditProfile(false);

                    //auth.currentUser?.emailVerified;
                  }
                });
                }}>Save</IonButton>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol style={{textAlign: "center"}}>
                <IonButton shape="round" fill="outline" color="danger" onClick={ () => auth.signOut()}>Logout</IonButton>
              </IonCol>
            </IonRow>
            </IonGrid>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default Profile;
