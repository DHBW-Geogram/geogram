/* eslint-disable react/jsx-no-undef */
import { IonButton, IonCol, IonContent, IonFab, IonFabButton, IonGrid, IonHeader, IonIcon, IonImg, IonInput, IonItem, IonLabel, IonPage, IonRow, IonTextarea, IonTitle, IonToast, IonToolbar } from '@ionic/react';
import { useCamera } from '@ionic/react-hooks/camera';
import { camera } from 'ionicons/icons';
import React, { useEffect, useState } from 'react';
import { Photo, usePhotoGallery } from '../../hooks/usePhotoGallery';
import { Plugins} from "@capacitor/core";
import { GeogramPosition } from '../../model/GeogramPosition';
import LocationMap from '../../components/LocationMap/LocationMap';
import axios from "axios"


const { Geolocation} = Plugins;


const Upload: React.FC<any> = (props) => {
  
  // image provided by props
  const [image, setImage] = useState<Photo>();

  // Form data
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")

  // Geoinformation
  const [location, setLocation] = useState<GeogramPosition>();

  // Toast message
  const [toast, setToast] = useState("")

  useEffect(() => {
    
    if(props.location.state !== undefined){
      setImage(props.location.state.image)
    }

    // get current geolocation
    Geolocation.getCurrentPosition()
    .then(location => {
      setLocation({
        coords: {
          accuracy: location.coords.accuracy,
          altitude: location.coords.altitude,
          altitudeAccuracy: location.coords.altitudeAccuracy,
          heading: location.coords.heading,
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          speed: location.coords.speed
        },
        timestamp: location.timestamp
      })
    })

  },[props.location.state])

  const upload = async() => {

    if(title !== "" && description !== "" && image !== undefined){
      // upload process

      var formData = new FormData();

      if(image.webviewPath !== undefined){

        let img = await axios.get(image.webviewPath);

        formData.append("myImage", img.data)
        axios.post('http://localhost:5000/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }).then(res => console.log("Result: ", res));

      }

      // wait for api
      // cleanup of input fields

    }else{
      if(title === ""){
        setToast("Please fill out the title field!");
      }else if(description === ""){
        setToast("Please fill out the description field!");
      }else{
        setToast("Error occured!");
      }
    }

  }

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
        {
          image && 
            <>
              <IonImg src={image.webviewPath}/>
              <IonGrid>
                <IonRow>
                  <IonCol size="12">
                    <IonItem>
                      <IonLabel position="floating">Title</IonLabel>
                      <IonInput type="text" value={title} onIonChange={(e) => {setTitle(e.detail.value!)}}/>
                   </IonItem>
                  </IonCol>
                </IonRow>
                <IonRow>
                  <IonCol size="12">
                    <IonItem>
                      <IonLabel position="floating">Description</IonLabel>
                      <IonTextarea value={description} onIonChange={(e) => {setDescription(e.detail.value!)}}/>
                    </IonItem>
                  </IonCol>
                </IonRow>
                <IonRow>
                  <IonCol size="12">
                    Current Position: Latitude: {location?.coords.latitude.toString()}, Longitude: {location?.coords.longitude.toString()} 
                  </IonCol>
                </IonRow>
                <IonRow>
                  <IonCol size="12">
                    {
                      location && 
                        <LocationMap location={location}/>
                    }
                  </IonCol>
                </IonRow>
                <IonRow>
                  <IonCol>
                    <IonButton onClick={upload}>Submit</IonButton>
                  </IonCol>
                </IonRow>
              </IonGrid>
            </>
        }

        <IonToast
          isOpen={toast !== ""}
          onDidDismiss={() => setToast("")}
          message={toast}
          duration={1500}
        />

      </IonContent>
    </IonPage>
  );
};

export default Upload;