import { IonPage, IonImg, IonContent } from "@ionic/react";
import React from "react";
 

const LoadingPage: React.FC = () => {
  return (
    <IonPage>
      <IonContent>
        <IonImg src='../../../public/assets/icon/logo.png' />
      </IonContent>
    </IonPage>
  );
};

export default LoadingPage;