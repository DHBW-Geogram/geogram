/* eslint-disable react/jsx-no-undef */
import { IonCol, IonContent, IonGrid, IonHeader, IonImg, IonPage, IonRow, IonTitle, IonToolbar } from '@ionic/react';
import { useCamera } from '@ionic/react-hooks/camera';
import React from 'react';
import { usePhotoGallery } from '../../hooks/usePhotoGallery';

const Camera: React.FC = () => {
  
  const { takePhoto } = usePhotoGallery();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Camera</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Camera</IonTitle>
          </IonToolbar>
        </IonHeader>

       

      </IonContent>
    </IonPage>
  );
};

export default Camera;
