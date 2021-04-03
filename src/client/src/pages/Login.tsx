import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonInput, IonButton, IonItem, IonLabel, IonIcon, IonButtons, IonGrid } from "@ionic/react";
import { chevronBackOutline, logInOutline } from "ionicons/icons";
import React from "react";
import { Redirect, Route } from "react-router";
import { Router } from "workbox-routing/Router";
import Tab1 from "./Tab1";

import { Link, RouteComponentProps } from 'react-router-dom';
import './Login.css'
import { IonReactRouter } from "@ionic/react-router";
import MainTabs from "./MainTabs";

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
  