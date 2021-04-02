/* eslint-disable react/jsx-no-undef */
import { IonButton, IonCol, IonContent, IonFab, IonFabButton, IonGrid, IonHeader, IonIcon, IonImg, IonInput, IonItem, IonLabel, IonPage, IonRow, IonTextarea, IonTitle, IonToolbar } from '@ionic/react';
import { useCamera } from '@ionic/react-hooks/camera';
import { camera } from 'ionicons/icons';
import React, { useEffect, useState } from 'react';
import { Photo, usePhotoGallery } from '../../hooks/usePhotoGallery';

const Upload: React.FC<any> = (props) => {
  
  const [image, setImage] = useState<Photo>();

  // Form data
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")

  useEffect(() => {
    
    if(props.location.state !== undefined){
      setImage(props.location.state.image)
    }

  },[props.location.state])

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
                      <IonLabel position="floating">Title</IonLabel>
                      <IonTextarea value={title} onIonChange={(e) => {setTitle(e.detail.value!)}}/>
                    </IonItem>
                  </IonCol>
                </IonRow>
                <IonRow>
                  <IonCol>
                    <IonButton onClick={() => {}}>Submit</IonButton>
                  </IonCol>
                </IonRow>
              </IonGrid>
            </>
        }

      </IonContent>
    </IonPage>
  );
};

export default Upload;
