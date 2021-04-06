
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonIcon, IonInput, IonItem, IonLabel, IonCol, IonGrid, IonRow } from "@ionic/react";
import { chevronBackOutline, logInOutline, personAddOutline } from "ionicons/icons";
import React, {useState} from "react";
import { fb, db } from "../../helper/firebase";
import './Register.css'

const Register: React.FC = () => (
    <IonPage>
        <IonHeader>
            <IonToolbar>
                <IonButtons slot="start">
                    <IonButton color="primary" routerLink="/firstPage">
                        <IonIcon  icon={chevronBackOutline}/>
                    </IonButton>
                </IonButtons>
                <IonTitle>Register</IonTitle>
            </IonToolbar>
        </IonHeader>

        <IonContent fullscreen>
            <IonGrid>  
                <br/>              
                <IonItem>
                    <IonLabel position="floating">First Name</IonLabel>
                    <IonInput></IonInput>
                </IonItem>
                <br/>
                <IonItem>
                    <IonLabel position="floating">Second Name</IonLabel>
                    <IonInput></IonInput>
                </IonItem>                        
                <br/>
                <IonItem>
                    <IonLabel position="floating">Email</IonLabel>
                    <IonInput></IonInput>
                </IonItem>
                <br/>
                <IonItem>
                    <IonLabel position="floating">Password</IonLabel>
                    <IonInput></IonInput>
                </IonItem>
                <br/>
                <IonItem>
                    <IonLabel position="floating">Confirm Password </IonLabel>
                    <IonInput></IonInput>
                </IonItem> 
                <br/>
                <div className="SignInButton">
                    <IonButton routerLink="/mainTabs">
                        Register
                    <IonIcon icon={personAddOutline}/>
                    </IonButton>
                </div>

            </IonGrid>
        </IonContent>
    </IonPage>
);
  
  export default Register;
  