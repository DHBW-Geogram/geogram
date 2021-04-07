import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonInput, IonButton, IonItem, IonLabel, IonIcon, IonButtons, IonGrid, IonAlert } from "@ionic/react";
import { chevronBackOutline, logInOutline } from "ionicons/icons";
import React, {useCallback, useEffect, useState} from "react";
import './Login.css'
import { fb, db, auth } from "../../helper/firebase";

import "firebase/auth";
import { Link, Redirect, useHistory, useLocation } from "react-router-dom";


const Login: React.FC = () => {

    
    const [email, setEmail] = useState("");    
     const [password, setPassword] = useState("");
     const [alertText, setAlertText] = useState('')
     const history = useHistory(); 
     const location = useLocation(); 
     
    //  useEffect(() => {
    //     if(auth.currentUser) history.push('/');
    // },[history, location]);


   const onEmailNameChange = useCallback((e) =>
   setEmail(e.detail?.value), []);
   const onPasswordChange = useCallback((e) =>
   setPassword(e.detail?.value), []);
    
   const onLoginClick = useCallback(() => {
    if(email.length === 0) setAlertText("Email Required");
    else if(password.length === 0) setAlertText("Password Required");
    else{
        auth.signInWithEmailAndPassword(email,password).then(() => {           
            history.push('/tabs')
        }).catch(err => setAlertText(err.message));
    }       
},[email.length, password.length]);   
              
const onDismiss = useCallback(() => setAlertText(''), []);

    return (    
    <IonPage>
        <IonHeader>
            <IonToolbar>
                <IonButtons slot="start">
                    <IonButton color="primary" routerLink="/home">
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
                    <IonInput onIonChange={onEmailNameChange}
                    value={email}
                    class="input"
                    type="email"  ></IonInput>
                </IonItem>
                <br/>
                <IonItem>
                    <IonLabel position="floating">Password</IonLabel>
                    <IonInput  onIonChange={onPasswordChange}
                    value={password}
                    type="password" > 
                    </IonInput>
                </IonItem>
                <br/>
                <div className="LogInButton">
                    <IonButton  onClick={onLoginClick}>
                        Login
                        <IonIcon icon={logInOutline}/>
                    </IonButton>
                </div>
            </IonGrid>
        </IonContent>
        <IonAlert
                isOpen={alertText.length > 0}
                onDidDismiss={onDismiss}
                message={alertText}
                buttons={['OK']}

            />
    </IonPage>
);
};
  export default Login;

