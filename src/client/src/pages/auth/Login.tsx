import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonInput, IonButton, IonItem, IonLabel, IonIcon, IonButtons, IonGrid } from "@ionic/react";
import { chevronBackOutline, logInOutline } from "ionicons/icons";
import React, {useState} from "react";
import './Login.css'
import { fb, db } from "../../helper/firebase";

const Login: React.FC = () => {
 
    
    return (    
    <IonPage>
        <IonHeader>
            <IonToolbar>
                <IonButtons slot="start">
                    <IonButton color="primary" routerLink="/firstPage">
                        <IonIcon  icon={chevronBackOutline}/>
                    </IonButton>
                </IonButtons>
                <IonTitle>Login</IonTitle>
            </IonToolbar>
        </IonHeader>

        <IonContent fullscreen>
            <IonGrid>
                <br/>
                <IonItem>
                    <IonLabel position="floating">Username</IonLabel>
                    <IonInput ></IonInput>
                </IonItem>
                <br/>
                <IonItem>
                    <IonLabel position="floating">Password</IonLabel>
                    <IonInput ></IonInput>
                </IonItem>
                <br/>
                <div className="LogInButton">
                    <IonButton routerLink="/mainTabs">
                        Login
                        <IonIcon icon={logInOutline}/>
                    </IonButton>
                </div>
            </IonGrid>
        </IonContent>
    </IonPage>
);
};
  export default Login;
  