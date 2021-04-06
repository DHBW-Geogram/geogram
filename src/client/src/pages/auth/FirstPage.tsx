import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonInput, IonButton, IonItem, IonLabel, IonIcon, IonText, IonCol, IonGrid, IonRow } from "@ionic/react";
import { logInOutline, personAddOutline } from "ionicons/icons";
import React from "react";


import './FirstPage.css';

const FirstPage: React.FC = () => {
    
    
    return (    
    <IonPage>
        <IonContent fullscreen >
            <IonGrid>
                <IonRow>
                    <IonCol>
                        <br /><br /><br /><br /><br /><br /><br /><br />
                        <IonText color="primary" class="title">
                            <h1>Geogram</h1>
                        </IonText>
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol>
                        <div className="LogInButton">
                            <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />        
                            <IonButton  routerLink="/login">
                                Log In
                                <IonIcon icon={logInOutline}/>
                            </IonButton>
                        </div>
                    </IonCol>
     
                    <IonCol >
                        <div className="SignInButton">
                        <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
                            <IonButton routerLink="/register">
                                Sign Up
                                <IonIcon icon={personAddOutline}/>
                            </IonButton>
                        </div>
                    </IonCol>
                </IonRow>
            </IonGrid>
        </IonContent>
    </IonPage>
);
};
  export default FirstPage;
  