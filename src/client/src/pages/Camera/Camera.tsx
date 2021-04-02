/* eslint-disable react/jsx-no-undef */
import { IonCol, IonContent, IonFab, IonFabButton, IonGrid, IonHeader, IonIcon, IonImg, IonPage, IonRow, IonTitle, IonToolbar } from '@ionic/react';
import { useCamera } from '@ionic/react-hooks/camera';
import { camera } from 'ionicons/icons';
import React, { useEffect } from 'react';
import { usePhotoGallery } from '../../hooks/usePhotoGallery';

const Camera: React.FC = () => {
  
  const { takePhoto } = usePhotoGallery();

  useEffect(() => {
    
    takePhoto();

  }, [])

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
