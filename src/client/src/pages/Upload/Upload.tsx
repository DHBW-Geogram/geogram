/* eslint-disable react/jsx-no-undef */
import {
  IonButton,
  IonCol,
  IonContent,
  IonFab,
  IonFabButton,
  IonGrid,
  IonHeader,
  IonIcon,
  IonImg,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  IonRow,
  IonTextarea,
  IonTitle,
  IonToast,
  IonToolbar,
  isPlatform,
} from "@ionic/react";
import { useCamera } from "@ionic/react-hooks/camera";
import { camera } from "ionicons/icons";
import React, { useEffect, useState } from "react";
import { Photo, usePhotoGallery } from "../../hooks/usePhotoGallery";
import { useFilesystem, base64FromPath } from "@ionic/react-hooks/filesystem";
import {
  FilesystemDirectory,
  FilesystemEncoding,
  Plugins,
} from "@capacitor/core";
import { GeogramPosition } from "../../model/GeogramPosition";
import LocationMap from "../../components/LocationMap/LocationMap";
import axios from "axios";
import { db } from "../../helper/firebase";
import { v4 as uuidv4 } from "uuid";
import { Redirect } from "react-router";
import { useStorage } from "@ionic/react-hooks/storage";

const { Geolocation, Filesystem } = Plugins;

const Upload: React.FC<any> = (props) => {
  const { get } = useStorage();
  const { deleteFile, readFile, writeFile } = useFilesystem();
  const { convertBlobToBase64 } = usePhotoGallery();

  // image provided by props
  const [image, setImage] = useState<Photo>();

  // Form data
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // Geoinformation
  const [location, setLocation] = useState<GeogramPosition>();

  // Toast message
  const [toast, setToast] = useState("");

  // Redirect
  const [redirect, setRedirect] = useState("");

  // Debug
  const [log, setLog] = useState("");

  useEffect(() => {
    if (props.location.state !== undefined) {
      setImage(props.location.state.image);
    }

    // get current geolocation
    Geolocation.getCurrentPosition().then((location) => {
      setLocation({
        coords: {
          accuracy: location.coords.accuracy,
          altitude: location.coords.altitude,
          altitudeAccuracy: location.coords.altitudeAccuracy,
          heading: location.coords.heading,
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          speed: location.coords.speed,
        },
        timestamp: location.timestamp,
      });
    });

    //disable set Loading
    props.setLoading(false);
  }, [props.location.state]);

  const upload = async () => {
    props.setLoading(true);

    if (location === undefined) {
      setLocation({
        coords: {
          accuracy: 0,
          altitude: 0,
          altitudeAccuracy: 0,
          heading: 0,
          latitude: 0,
          longitude: 0,
          speed: 0,
        },
        timestamp: Date.now(),
      });
    }

    if (title !== "" && description !== "" && image !== undefined) {
      // upload process: image -> image server
      var formData = new FormData();

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

        if (
          (await base64FromPath(image.webviewPath!))
            .toString()
            .split(",")[1] === file.data
        ) {
          setToast("correct!!");
        } else {
          setToast("Handy bild != computer bild");
        }

        setLog("Got Image data: " + file.data);

        // Append file data to form //deprecated //todo
        formData.append("myImage", file.data);

        let res: any = await axios.post(`${process.env.REACT_APP_IMAGE_SERVER_URL}/upload1`,{data: file.data});

        // let res: any = await axios.post(
        //     `${process.env.REACT_APP_IMAGE_SERVER_URL}/upload1`,
        //     formData,
        //     {
        //       headers: {
        //         "Content-Type": "multipart/form-data",
        //       },
        //     }
        //   );

        if (res.data.file !== undefined) {
          let imageId: string = uuidv4();

          db.collection("images")
            .doc(imageId)
            .set({
              id: imageId,
              timestamp: Date.now(),
              user: "userid",
              location: location,
              url: `${process.env.REACT_APP_IMAGE_SERVER_URL}/${res.data.file}`,
              title: title,
              description: description,
            })
            .then((res) => {
              setToast("Successfully added item to firebase");

              // Set back everything
              setTitle("");
              setDescription("");
              setImage(undefined);
              setLocation(undefined);

              setTimeout(() => {
                setRedirect("explore");
                props.setLoading(false);
              }, 1000);
            })
            .catch((err) => setToast("Error while adding data to firebase"));
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
      if (title === "") {
        setToast("Please fill out the title field!");
      } else if (description === "") {
        setToast("Please fill out the description field!");
      } else {
        setToast("Error occured!");
      }
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
            <IonImg src={image.webviewPath} />
            <IonGrid>
              <IonRow>
                <IonCol size="12">
                  <IonItem>
                    <IonLabel position="floating">Title</IonLabel>
                    <IonInput
                      type="text"
                      value={title}
                      onIonChange={(e) => {
                        setTitle(e.detail.value!);
                      }}
                    />
                  </IonItem>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol size="12">
                  <IonItem>
                    <IonLabel position="floating">Description</IonLabel>
                    <IonTextarea
                      value={description}
                      onIonChange={(e) => {
                        setDescription(e.detail.value!);
                      }}
                    />
                  </IonItem>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol size="12">
                  Current Position: Latitude:{" "}
                  {location?.coords.latitude.toString()}, Longitude:{" "}
                  {location?.coords.longitude.toString()}
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol size="12">
                  {location && <LocationMap location={location} />}
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol>
                  <IonButton onClick={upload}>Submit</IonButton>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol size="12">
                  <IonItem>
                    <IonLabel position="floating">Log</IonLabel>
                    <IonTextarea value={log} />
                  </IonItem>
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

export default Upload;
