/* eslint-disable react/jsx-no-undef */
import {
  IonButton,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonImg,
  IonPage,
  IonRow,
  IonTitle,
  IonToast,
  IonToolbar,
  isPlatform,
} from "@ionic/react";
import React, { useContext, useEffect, useState } from "react";
import { Photo } from "../../hooks/usePhotoGallery";
import { base64FromPath } from "@ionic/react-hooks/filesystem";
import {
  FilesystemDirectory,
  FilesystemEncoding,
  Plugins,
} from "@capacitor/core";
import axios from "axios";
import { db } from "../../helper/firebase";
import { Redirect } from "react-router";
import { UserContext } from "../..";
import { arrowForward } from "ionicons/icons";

const { Filesystem } = Plugins;

const ProfilePic: React.FC<any> = (props) => {
  const user = useContext(UserContext);

  // image provided by props
  const [image, setImage] = useState<Photo>();
  const [oldImage, setOldImage] = useState<string>(
    "https://im-coder.com/images4/15590312779219.png"
  );

  // Toast message
  const [toast, setToast] = useState("");

  // Redirect
  const [redirect, setRedirect] = useState("");

  useEffect(() => {
    console.log("useeffect - ProfilPic");

    if (props.location.state !== undefined) {
      setImage(props.location.state.image);
    }

    // get old picture from firebase and store it to state
    db.collection("users")
      .doc(user?.uid)
      .get()
      .then((data) => {
        if (data?.data()?.profilepic) {
          setOldImage(data?.data()?.profilepic);
        } else {
          setOldImage("https://im-coder.com/images4/15590312779219.png");
        }
      });

    //disable set Loading
    props.setLoading(false);
  }, [props.location.state]);

  const upload = async () => {
    props.setLoading(true);

    if (image !== undefined) {
      if (image.webviewPath !== undefined) {
        let file: any;
        // get image data when on android or ios
        if (isPlatform("android") || isPlatform("ios")) {
          file = {
            ...file,
            data: (await base64FromPath(image.webviewPath!))
              .toString()
              .split(",")[1],
          };
        } else {
          file = await Filesystem.readFile({
            path: image.filepath,
            directory: FilesystemDirectory.Data,
            encoding: FilesystemEncoding.UTF8,
          });
        }

        let res: any = await axios.post(
          `${process.env.REACT_APP_IMAGE_SERVER_URL}/upload1`,
          { data: file.data }
        );

        if (res.data.file !== undefined) {
          db.collection("users")
            .doc(user?.uid)
            .get()
            .then((data) => {
              db.collection("users")
                .doc(user?.uid)
                .set(
                  {
                    ...data.data(),
                    profilepic:
                      `${process.env.REACT_APP_IMAGE_SERVER_URL}/` +
                      res.data.file,
                  },
                  { merge: true }
                )
                .then((s) => {
                  setToast("Successfully added item to firebase");
                  setTimeout(() => {
                    setRedirect("profile");
                    props.setLoading(false);
                  }, 100);
                })
                .catch((e) => {
                  console.log("Error while changing profile picture");
                });
            });
        } else {
          setToast(
            "Error while adding data to image server: " +
              process.env.REACT_APP_IMAGE_SERVER_URL
          );
        }
      }

      // wait for api
      // cleanup of input fields
    } else {
      setToast("Error occured!");
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Upload</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Upload</IonTitle>
          </IonToolbar>
        </IonHeader>

        {/* Upload Form with image view */}
        {image && (
          <>
            <IonGrid>
              <IonRow>
                <IonCol>
                  <h1>Change Profile Picture</h1>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol size="5">
                  <IonImg src={oldImage} />
                </IonCol>
                <IonCol
                  size="2"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <IonIcon
                    style={{ fontSize: "3em" }}
                    icon={arrowForward}
                  ></IonIcon>
                </IonCol>
                <IonCol size="5">
                  <IonImg src={image.webviewPath} />
                </IonCol>
              </IonRow>
              <br />
              <IonRow>
                <IonCol size="2" offset="4">
                  <IonButton
                    expand="block"
                    shape="round"
                    fill="outline"
                    color="primary"
                    onClick={upload}
                  >
                    Submit
                  </IonButton>
                </IonCol>
                <IonCol size="2">
                  <IonButton
                    expand="block"
                    shape="round"
                    fill="outline"
                    color="danger"
                    onClick={() => {
                      setOldImage(
                        "https://im-coder.com/images4/15590312779219.png"
                      );
                      setImage(undefined);
                      setRedirect("profile");
                    }}
                  >
                    Cancel
                  </IonButton>
                </IonCol>
              </IonRow>
            </IonGrid>
          </>
        )}

        {/* Toast */}
        <IonToast
          isOpen={toast !== ""}
          onDidDismiss={() => setToast("")}
          message={toast}
          duration={1500}
        />
        {/* Redirect */}
        {redirect !== "" && <Redirect to={`/${redirect}`}></Redirect>}
      </IonContent>
    </IonPage>
  );
};

export default ProfilePic;
