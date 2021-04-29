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
  IonRefresher,
  IonRefresherContent,
  useIonToast,
  IonLoading,
  IonActionSheet,
} from "@ionic/react";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import ProfilePicSelectionModal from "../../components/ProfilePicSelectionModal/ProfilePicSelectionModal";
import { auth, db } from "../../helper/firebase";
import { checkUsername } from "./checkUsername";
import { RefresherEventDetail } from "@ionic/core";
import { trash, close, information } from "ionicons/icons";

const Profile: React.FC<{ setLoading: Dispatch<SetStateAction<boolean>> }> = ({
  setLoading,
}) => {
  // modal to change profile picture
  const [profileSelectionModal, setProfileSelectionModal] = useState(false);

  const [EditProfile, setEditProfile] = useState<boolean>(false);
  const [username, setUsername] = useState<string>();
  const [firstName, setFirstName] = useState<string>();
  const [lastName, setLastName] = useState<string>();
  const [fullName, setFullName] = useState<string>();
  const [email, setEmail] = useState<string>();
  const [bio, setBio] = useState<string>();
  const [showAlertVerify, setShowAlertVerify] = useState<boolean>(false);
  const [verified, setVerified] = useState<string>("");
  const [profilepic, setProfilepic] = useState(
    "https://im-coder.com/images4/15590312779219.png"
  );

  const [posts, setPosts] = useState<number>(0);
  let postsUsername: string = "";
  const [likes, setLikes] = useState<number>(0);
  let counterLikes: number = 0;

  const [errorUsernameLabel, setErrorUsernameLabel] = useState<string>("");
  const [errorUsernameText, setErrorUsernameText] = useState<string>("");

  let isUsernameCorrect: boolean = true;

  let oldUsername: string = "";

  const [errorEmailLabel, setErrorEmailLabel] = useState<string>("");
  const [errorEmailText, setErrorEmailText] = useState<string>("");

  let isEmailCorrect: boolean = true;

  const [presentToast, dismissToast] = useIonToast();

  const [showAlertLogin, setShowAlertLogin] = useState<boolean>(false);
  const [
    showAlertIncorrectPassword,
    setShowAlertIncorrectPassword,
  ] = useState<boolean>(false);
  let isShowAlertLogin: boolean = false;
  const [isLoginSuccessfull, setLoginSuccessfull] = useState<boolean>(false);

  const [showLoading, setShowLoading] = useState(false);

  let imageListCounter: string[] = [];
  let imageListListCounter: string[][] = [];
  const [imageList, setImageList] = useState<string[][]>([]);

  const [showActionSheet, setShowActionSheet] = useState<boolean>(false);
  const [imageState, setImageState] = useState<string>("");

  const [showAlertDelete, setShowAlertDelete] = useState<boolean>(false);

  useEffect(() => {
    if (auth.currentUser?.emailVerified) {
      setVerified("none");
    } else {
      setVerified("");
    }

    auth.currentUser?.reload().then(() => {
      db.collection("users")
        .doc(auth.currentUser?.uid)
        .update({
          email: auth.currentUser?.email,
        }).then(() => {
          db.collection("users")
            .where("email", "==", auth.currentUser?.email)
            .get()
            .then((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                if (doc.data().profilepic != null) {
                  setProfilepic(doc.data().profilepic);
                }
                setUsername(doc.data().username);
                setEmail(doc.data().email);
                setFirstName(doc.data().userFirstName);
                setLastName(doc.data().userLastName);
                setBio(doc.data().biography);
                setFullName(doc.data().userFirstName + " " + doc.data().userLastName);
              });
            });
        });
    });
  }, [EditProfile]);

  useEffect(() => {
    refreshLikesPostsImages();
  }, []);

  function refreshLikesPostsImages() {
    auth.currentUser?.reload().then(() => {
      db.collection("users")
        .doc(auth.currentUser?.uid)
        .update({
          email: auth.currentUser?.email,
        }).then(() => {
          db.collection("users")
            .where("email", "==", auth.currentUser?.email)
            .get()
            .then((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                postsUsername = doc.data().username;
              });
            })
            .then(() => {
              db.collection("images")
                .where("user", "==", postsUsername)
                .get()
                .then((querySnapshot) => {
                  setPosts(querySnapshot.size);
                  counterLikes = 0;
                  imageListCounter = [];
                  querySnapshot.forEach((doc) => {
                    if (!(doc.data().likes == null)) {
                      counterLikes = counterLikes + doc.data().likes;
                    }
                    imageListCounter.push(doc.data().url as string);
                  });
                  setLikes(counterLikes);

                  imageListListCounter = [];

                  for (var i = 0; imageListCounter.length > 0; i++) {
                    imageListListCounter[i] = [];
                    for (var j = 0; j < 3; j++) {
                      if (imageListCounter.length > 0) {
                        imageListListCounter[i].push(imageListCounter.pop() as string);
                      }
                    }
                  }

                  setImageList(imageListListCounter);
                });
            });
        });
    });
  }

  async function refreshAll(event: CustomEvent<RefresherEventDetail>) {
    if (auth.currentUser?.emailVerified) {
      setVerified("none");
    } else {
      setVerified("");
    }

    auth.currentUser?.reload().then(() => {
      db.collection("users")
        .doc(auth.currentUser?.uid)
        .update({
          email: auth.currentUser?.email,
        }).then(async () => {
          await db
            .collection("users")
            .where("email", "==", auth.currentUser?.email)
            .get()
            .then((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                if (doc.data().profilepic != null) {
                  setProfilepic(doc.data().profilepic);
                }
                setUsername(doc.data().username);
                setEmail(doc.data().email);
                setFirstName(doc.data().userFirstName);
                setLastName(doc.data().userLastName);
                setBio(doc.data().biography);
                postsUsername = doc.data().username;
                setFullName(doc.data().userFirstName + " " + doc.data().userLastName);
              });
            })
            .then(() => {
              db.collection("images")
                .where("user", "==", postsUsername)
                .get()
                .then((querySnapshot) => {
                  setPosts(querySnapshot.size);
                  counterLikes = 0;
                  imageListCounter = [];
                  querySnapshot.forEach((doc) => {
                    if (!(doc.data().likes == null)) {
                      counterLikes = counterLikes + doc.data().likes;
                    }
                    imageListCounter.push(doc.data().url as string);
                  });
                  setLikes(counterLikes);

                  imageListListCounter = [];

                  for (var i = 0; imageListCounter.length > 0; i++) {
                    imageListListCounter[i] = [];
                    for (var j = 0; j < 3; j++) {
                      if (imageListCounter.length > 0) {
                        imageListListCounter[i].push(imageListCounter.pop() as string);
                      }
                    }
                  }

                  setImageList(imageListListCounter);
                });
            })
        })
    }).then(() => {
      event.detail.complete();
    });
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
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
                  onClick={() => {
                    setProfileSelectionModal(true);
                  }}
                >
                  <IonImg src={profilepic} />
                </IonAvatar>

                <ProfilePicSelectionModal
                  active={profileSelectionModal}
                  setShowActionSheet={setProfileSelectionModal}
                  setLoading={setLoading}
                />

                <IonGrid>
                  <IonRow>
                    <IonCol style={{ textAlign: "center" }}>{likes}</IonCol>
                    <IonCol style={{ textAlign: "center" }}>{posts}</IonCol>
                  </IonRow>
                  <IonRow>
                    <IonCol style={{ textAlign: "center" }}>Likes</IonCol>
                    <IonCol style={{ textAlign: "center" }}>Posts</IonCol>
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
                  setShowAlertVerify(true);
                  await auth.currentUser?.sendEmailVerification();
                }}
              >
                Verify Email
              </IonButton>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonGrid>
              {
                imageList.map((image, id) => {
                  return <IonRow key={id}>
                    {
                      image.map(img => {
                        return <IonCol size="4">
                          <IonImg src={img} style={{ height: "100%", objectFit: "cover" }} onClick={() => {
                            setImageState(img as string);
                            setShowActionSheet(true);
                          }} />
                        </IonCol>
                      })
                    }
                  </IonRow>
                })
              }
            </IonGrid>
          </IonRow>
        </IonGrid>
        <IonActionSheet
          isOpen={showActionSheet}
          onDidDismiss={() => setShowActionSheet(false)}
          header="Image Settings"
          buttons={[{
            text: 'Info',
            icon: information,
            handler: () => {
              console.log('Info clicked');
              setShowActionSheet(false);
              //find image with "imageState"
            }
          }, {
            text: 'Delete',
            role: 'destructive',
            icon: trash,
            handler: () => {
              console.log('Delete clicked');
              setShowActionSheet(false);
              setShowAlertDelete(true);
            }
          },
          {
            text: 'Cancel',
            icon: close,
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
              setShowActionSheet(false);
            }
          }
          ]}
        >
        </IonActionSheet>
        <IonAlert
          isOpen={showAlertDelete}
          header={"Are you sure?"}
          message={
            "Are you sure you want to delete the image?"
          }
          buttons={[
            {
              text: "Cancel",
              role: "cancel",
              cssClass: "secondary",
              handler: () => {
                console.log("Confirm Cancel");
                setShowAlertDelete(false);
              },
            },
            {
              text: "Yes",
              handler: () => {
                setShowLoading(true);
                console.log("Confirm Yes");
                setShowAlertDelete(false);

                db.collection("images")
                  .where("url", "==", imageState as string)
                  .get()
                  .then((querySnapshot) => {
                    querySnapshot.forEach(async (doc) => {
                      await db
                        .collection("images")
                        .doc(doc.data().id)
                        .delete()
                        .then(() => {
                          console.log("Delete successfull!");
                        })
                        .catch((error) => {
                          console.log("Error delete image: ", error);
                        });
                    });
                  })
                  .then(() => {
                    refreshLikesPostsImages();
                  })
                  .then(() => {
                    setShowLoading(false);
                  });
              },
            },
          ]}
        />
        <IonAlert
          isOpen={showAlertVerify}
          onDidDismiss={() => setShowAlertVerify(false)}
          cssClass="my-custom-class"
          header={"Verify E-Mail"}
          message={"Email was sent to you to verify your email."}
          buttons={["OK"]}
        />
        <IonRefresher
          slot="fixed"
          pullFactor={0.5}
          pullMin={100}
          pullMax={200}
          onIonRefresh={refreshAll}
        >
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>
        <IonModal isOpen={EditProfile}>
          <IonHeader>
            <IonToolbar>
              <IonButtons slot="end">
                <IonButton
                  color="primary"
                  onClick={() => {
                    dismissToast();
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
                      dismissToast();
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
                      setShowLoading(true);
                      dismissToast();
                      isShowAlertLogin = false;
                      isUsernameCorrect = true;
                      isEmailCorrect = true;

                      const data = {
                        username: username,
                        userFirstName: firstName,
                        userLastName: lastName,
                        email: email,
                        biography: bio,
                        profilepic: profilepic,
                      };

                      await db
                        .collection("users")
                        .where("email", "==", auth.currentUser?.email)
                        .get()
                        .then((querySnapshot) => {
                          querySnapshot.forEach((doc) => {
                            oldUsername = doc.data().username;
                          });
                        })
                        .then(async () => {
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
                              await auth
                                .fetchSignInMethodsForEmail(email as string)
                                .then(async () => {
                                  await db
                                    .collection("users")
                                    .get()
                                    .then((querySnapshot) => {
                                      querySnapshot.forEach((doc) => {
                                        if (
                                          doc.data().email == email &&
                                          auth.currentUser?.email != email
                                        ) {
                                          isEmailCorrect = false;
                                          console.log(
                                            "Email bereits vorhanden!"
                                          );
                                          setErrorEmailLabel("danger");
                                          setErrorEmailText("danger");
                                        }
                                      });
                                    });
                                })
                                .catch((error) => {
                                  isEmailCorrect = false;
                                  console.log("Email ist Falsch!");
                                  setErrorEmailLabel("danger");
                                  setErrorEmailText("danger");
                                });
                              if (
                                email != auth.currentUser?.email &&
                                isEmailCorrect &&
                                isUsernameCorrect
                              ) {
                                await auth.currentUser
                                  ?.updateEmail(email as string)
                                  .then(async function () {
                                    console.log("Email-Update successfull!");
                                    await auth.currentUser
                                      ?.sendEmailVerification()
                                      .then(async function () {
                                        console.log("Send Email successfull!");
                                        setErrorEmailLabel("");
                                        setErrorEmailText("");
                                        isEmailCorrect = true;
                                        if (isUsernameCorrect) {
                                          await db
                                            .collection("users")
                                            .doc(auth.currentUser?.uid)
                                            .update({
                                              biography: data.biography,
                                              email: data.email,
                                              profilepic: data.profilepic,
                                              userFirstName: data.userFirstName,
                                              userLastName: data.userLastName,
                                              username: data.username,
                                            });
                                        }
                                      })
                                      .catch(function (error) {
                                        console.log("Send Email ERROR!");
                                      });
                                  })
                                  .catch(function (error) {
                                    setErrorEmailLabel("");
                                    setErrorEmailText("");
                                    isShowAlertLogin = true;
                                    setShowAlertLogin(true);
                                  });
                              } else {
                                if (isEmailCorrect) {
                                  setErrorEmailLabel("");
                                  setErrorEmailText("");
                                }

                                if (isUsernameCorrect && isEmailCorrect) {
                                  await db
                                    .collection("users")
                                    .doc(auth.currentUser?.uid)
                                    .update({
                                      biography: data.biography,
                                      email: data.email,
                                      profilepic: data.profilepic,
                                      userFirstName: data.userFirstName,
                                      userLastName: data.userLastName,
                                      username: data.username,
                                    });
                                }
                              }
                            })
                            .then(async () => {
                              if (
                                username != oldUsername &&
                                isUsernameCorrect &&
                                isEmailCorrect &&
                                !isShowAlertLogin
                              ) {
                                await db
                                  .collection("images")
                                  .where("user", "==", oldUsername)
                                  .get()
                                  .then((querySnapshot) => {
                                    querySnapshot.forEach(async (doc) => {
                                      await db
                                        .collection("images")
                                        .doc(doc.data().id)
                                        .update({
                                          user: username,
                                        });
                                    });
                                  });
                              }
                            })
                            .then(() => {
                              if (!isUsernameCorrect && !isEmailCorrect) {
                                presentToast({
                                  buttons: [
                                    {
                                      text: "hide",
                                      handler: () => dismissToast(),
                                    },
                                  ],
                                  message:
                                    "Username and Email already exists or invalid!",
                                  duration: 5000,
                                  color: "danger",
                                });
                              } else if (!isUsernameCorrect) {
                                presentToast({
                                  buttons: [
                                    {
                                      text: "hide",
                                      handler: () => dismissToast(),
                                    },
                                  ],
                                  message:
                                    "Username already exists or invalid!",
                                  duration: 5000,
                                  color: "danger",
                                });
                              } else if (!isEmailCorrect) {
                                presentToast({
                                  buttons: [
                                    {
                                      text: "hide",
                                      handler: () => dismissToast(),
                                    },
                                  ],
                                  message: "Email already exists or invalid!",
                                  duration: 5000,
                                  color: "danger",
                                });
                              } else {
                                dismissToast();
                                if (!isShowAlertLogin) {
                                  setEditProfile(false);
                                }
                              }
                            });
                        })
                        .then(() => {
                          setShowLoading(false);
                        });
                    }}
                  >
                    Save
                  </IonButton>
                  <IonAlert
                    isOpen={showAlertLogin}
                    cssClass="my-custom-class"
                    header={"Login"}
                    message={
                      "Enter your password and try to save your data again."
                    }
                    inputs={[
                      {
                        name: "Password",
                        type: "password",
                        placeholder: "Password",
                      },
                    ]}
                    buttons={[
                      {
                        text: "Cancel",
                        role: "cancel",
                        cssClass: "secondary",
                        handler: () => {
                          console.log("Confirm Cancel");
                          setShowAlertLogin(false);
                        },
                      },
                      {
                        text: "OK",
                        handler: async (e) => {
                          console.log("Confirm Ok");

                          await auth
                            .signInWithEmailAndPassword(
                              auth.currentUser?.email as string,
                              e.Password
                            )
                            .then(() => {
                              setShowAlertLogin(false);
                              setLoginSuccessfull(true);
                            })
                            .catch((err) => {
                              setShowAlertLogin(false);
                              setShowAlertIncorrectPassword(true);
                            });
                        },
                      },
                    ]}
                  />
                  <IonAlert
                    isOpen={showAlertIncorrectPassword}
                    onDidDismiss={() => {
                      setShowAlertIncorrectPassword(false);
                      setShowAlertLogin(true);
                    }}
                    cssClass="my-custom-class"
                    header={"Incorrect Password"}
                    message={"Your password is incorrect. Try again."}
                    buttons={["OK"]}
                  />
                  <IonAlert
                    isOpen={isLoginSuccessfull}
                    onDidDismiss={() => {
                      setLoginSuccessfull(false);
                    }}
                    cssClass="my-custom-class"
                    header={"Login Successful"}
                    message={"Now you can save your data again."}
                    buttons={["OK"]}
                  />
                  <IonLoading isOpen={showLoading} message={"Please wait..."} />
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol style={{ textAlign: "center" }}>
                  <IonButton
                    shape="round"
                    fill="outline"
                    color="danger"
                    onClick={() => {
                      dismissToast();
                      auth.signOut();
                    }}
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
