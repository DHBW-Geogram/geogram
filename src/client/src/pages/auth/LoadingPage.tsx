import { IonPage, IonImg, IonContent, IonCol, IonGrid, IonRow } from "@ionic/react";
import React from "react";
import './LoadingPage.css';
import icon from "../../assets/icon/icon.png";

const LoadingPage: React.FC = () => {
  return (
    <IonPage>
      
      <IonGrid>
          <IonRow className="Row">
            <IonCol
              size="12"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <IonImg className="Icon" src={icon} />
            </IonCol>
          </IonRow>
        </IonGrid>
      
    </IonPage>
  );
};

export default LoadingPage;
