/* eslint-disable react/jsx-no-undef */
import { IonButton, IonCol, IonContent, IonFab, IonFabButton, IonGrid, IonHeader, IonIcon, IonImg, IonInput, IonItem, IonLabel, IonPage, IonRow, IonTextarea, IonTitle, IonToast, IonToolbar } from '@ionic/react';
import { useCamera } from '@ionic/react-hooks/camera';
import { camera } from 'ionicons/icons';
import React, { useEffect, useState } from 'react';
import { Photo, usePhotoGallery } from '../../hooks/usePhotoGallery';

const Upload: React.FC<any> = (props) => {
  
  // image provided by props
  const [image, setImage] = useState<Photo>();

  // Form data
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")

  // Toast message
  const [toast, setToast] = useState("")

  useEffect(() => {
    
    if(props.location.state !== undefined){
      setImage(props.location.state.image)
    }

  },[props.location.state])

  const upload = () => {

    if(title !== "" && description !== "" && image !== undefined){
      // upload process

      

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
