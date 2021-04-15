import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonItem,
  IonAvatar,
  IonImg,
  IonLabel,
  IonGrid,
  IonRow,
  IonCol,
  IonButton,
  IonModal,
  IonButtons,
  IonInput,
  IonTextarea,
  IonAlert,
} from "@ionic/react";
import React, { Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import ProfilePicSelectionModal from "../../components/ProfilePicSelectionModal/ProfilePicSelectionModal";
import { auth, db } from "../../helper/firebase";
import { checkUsername } from "./checkUsername";

const Profile: React.FC<{ setLoading: Dispatch<SetStateAction<boolean>> }> = ({setLoading}) => {

  // modal to change profile picture
  const [profileSelectionModal, setProfileSelectionModal] = useState(false);

  const [EditProfile, setEditProfile] = useState<boolean>(false);
  const [username, setUsername] = useState<string>();
  const [firstName, setFirstName] = useState<string>();
  const [lastName, setLastName] = useState<string>();
  const [email, setEmail] = useState<string>();
  const [bio, setBio] = useState<string>();
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [verified, setVerified] = useState<string>("");
  const [profilepic, setProfilepic] = useState(undefined)

  const [errorUsernameLabel, setErrorUsernameLabel] = useState<string>("");
  const [errorUsernameText, setErrorUsernameText] = useState<string>("");

  //const [isUsernameCorrect, setUsernameCorrect] = useState<boolean>(true);
  let isUsernameCorrect: boolean = true;

  const [errorEmailLabel, setErrorEmailLabel] = useState<string>("");
  const [errorEmailText, setErrorEmailText] = useState<string>("");

  const [isEmailCorrect, setEmailCorrect] = useState<boolean>(true);

  useEffect(() => {
    db.collection("users")
      .where("email", "==", auth.currentUser?.email)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          setProfilepic(doc.data().profilepic);
          setUsername(doc.data().username);
          setEmail(doc.data().email);
          setFirstName(doc.data().userFirstName);
          setLastName(doc.data().userLastName);
          setBio(doc.data().biography);

        });
      });
  }, [EditProfile]);

  useEffect(() => {
    if (auth.currentUser?.emailVerified) {
      setVerified("none");
    } else {
      setVerified("");
    }
  });

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
                <IonAvatar
                  slot="start"
                  style={{ height: "100px", width: "100px" }}
                  onClick={() => {
                    setProfileSelectionModal(true);
                  }}
                >
                  <IonImg src={ profilepic ? profilepic : "https://im-coder.com/images4/15590312779219.png" } />
                </IonAvatar>

                <ProfilePicSelectionModal
                  active={profileSelectionModal}
                  setShowActionSheet={setProfileSelectionModal}
                  setLoading={setLoading}
                />

                <IonGrid>
                  <IonRow>
                    <IonCol style={{ textAlign: "center" }}>14</IonCol>
                    <IonCol style={{ textAlign: "center" }}>3</IonCol>
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
                        {username}
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
          <IonRow>
            <IonCol style={{ textAlign: "center" }}>
              <IonButton
                shape="round"
                fill="outline"
                color="primary"
                onClick={() => setEditProfile(true)}
              >
                Edit Profile
              </IonButton>
            </IonCol>
            <IonCol style={{ textAlign: "center", display: String(verified) }}>
              <IonButton
                shape="round"
                fill="outline"
                color="danger"
                onClick={async () => {
                  setShowAlert(true);
                  await auth.currentUser?.sendEmailVerification();
                }}
              >
                Verify Email
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          cssClass="my-custom-class"
          header={"Verify E-Mail"}
          message={"Email was sent to you to verify your email."}
          buttons={["OK"]}
        />
        <IonModal isOpen={EditProfile}>
          <IonHeader>
            <IonToolbar>
              <IonButtons slot="end">
                <IonButton
                  color="primary"
                  onClick={() => {
                    setEditProfile(false);
                    setErrorEmailLabel("");
                    setErrorEmailText("");
                    setErrorUsernameLabel("");
                    setErrorUsernameText("");
                  }}
                >
                  Close
                </IonButton>
              </IonButtons>
              <IonTitle>Edit Profile</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent fullscreen>
            <IonItem>
              <IonLabel color={errorUsernameLabel} position="floating">
                Username
              </IonLabel>
              <IonInput
                color={errorUsernameText}
                value={username}
                type="text"
                onIonChange={async (e) => setUsername(e.detail.value!)}
              ></IonInput>
            </IonItem>
            <IonItem>
              <IonLabel position="floating">First Name</IonLabel>
              <IonInput
                value={firstName}
                type="text"
                onIonChange={(e) => setFirstName(e.detail.value!)}
              ></IonInput>
            </IonItem>
            <IonItem>
              <IonLabel position="floating">Last Name</IonLabel>
              <IonInput
                value={lastName}
                type="text"
                onIonChange={(e) => setLastName(e.detail.value!)}
              ></IonInput>
            </IonItem>
            <IonItem>
              <IonLabel color={errorEmailLabel} position="floating">
                E-Mail
              </IonLabel>
              <IonInput
                color={errorEmailText}
                value={email}
                type="email"
                onIonChange={(e) => setEmail(e.detail.value!)}
              ></IonInput>
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Biography</IonLabel>
              <IonTextarea
                value={bio}
                onIonChange={(e) => setBio(e.detail.value!)}
              ></IonTextarea>
            </IonItem>
            <IonGrid>
              <IonRow>
                <IonCol style={{ textAlign: "center" }}>
                  <IonButton
                    expand="block"
                    shape="round"
                    fill="outline"
                    color="primary"
                    onClick={() => {
                      setEditProfile(false);
                      setErrorEmailLabel("");
                      setErrorEmailText("");
                      setErrorUsernameLabel("");
                      setErrorUsernameText("");
                    }}
                  >
                    Cancel
                  </IonButton>
                </IonCol>
                <IonCol style={{ textAlign: "center" }}>
                  <IonButton
                    expand="block"
                    shape="round"
                    fill="outline"
                    color="primary"
                    onClick={async () => {
                      isUsernameCorrect = true;
                      setEmailCorrect(true);

                      const data = {
                        username: username,
                        userFirstName: firstName,
                        userLastName: lastName,
                        email: email,
                        biography: bio,
                      };

                      await checkUsername(username)
                        .then(async (check) => {
                          if (check) {
                            setErrorUsernameLabel("danger");
                            setErrorUsernameText("danger");
                            isUsernameCorrect = false;
                          } else {
                            setErrorUsernameLabel("");
                            setErrorUsernameText("");
                            isUsernameCorrect = true;
                          }
                        })
                        .then(async () => {
                          if (email != auth.currentUser?.email) {
                            await auth.currentUser
                              ?.updateEmail(String(email))
                              .then(async function () {
                                console.log("Email-Update successfull!");
                                setEmailCorrect(true);
                                await auth.currentUser
                                  ?.sendEmailVerification()
                                  .then(async function () {
                                    console.log("Send Email successfull!");
                                    setErrorEmailLabel("");
                                    setErrorEmailText("");
                                    if (isUsernameCorrect) {
                                      setErrorUsernameLabel("");
                                      setErrorUsernameText("");
                                      await db
                                        .collection("users")
                                        .doc(auth.currentUser?.uid)
                                        .set(data);
                                      setEditProfile(false);
                                    }
                                  })
                                  .catch(function (error) {
                                    console.log("Send Email ERROR!");
                                  });
                              })
                              .catch(function (error) {
                                console.log("Email-Update ERROR!");
                                setErrorEmailLabel("danger");
                                setErrorEmailText("danger");
                                setEmailCorrect(false);
                              });
                          } else if (isUsernameCorrect) {
                            setErrorUsernameLabel("");
                            setErrorUsernameText("");
                            setErrorEmailLabel("");
                            setErrorEmailText("");
                            await db
                              .collection("users")
                              .doc(auth.currentUser?.uid)
                              .set(data);
                            setEditProfile(false);
                          }
                        });
                    }}
                  >
                    Save
                  </IonButton>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol style={{ textAlign: "center" }}>
                  <IonButton
                    shape="round"
                    fill="outline"
                    color="danger"
                    onClick={() => auth.signOut()}
                  >
                    Logout
                  </IonButton>
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
