
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonIcon, IonInput, IonItem, IonLabel, IonGrid, IonRow, IonAlert } from "@ionic/react";
import { chevronBackOutline, personAddOutline } from "ionicons/icons";
import React, {useCallback, useState} from "react";
import { fb, db, auth } from "../../helper/firebase";
import './Register.css'
import "firebase/auth";
import { useHistory, useLocation } from "react-router-dom";



const Register: React.FC = () => {

    const [email, setEmail] = useState("");    
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [alertText, setAlertText] = useState('')
    const history = useHistory();
   
    // useEffect(() => {
    //     if(auth.currentUser) history.push('/');
    // },[history, location]);

   const onEmailNameChange = useCallback((e) =>
   setEmail(e.detail?.value), []);
   const onPasswordChange = useCallback((e) =>
   setPassword(e.detail?.value), []);
   const onConfirmPasswordChange = useCallback((e) =>
   setConfirmPassword(e.detail?.value), []);


    const onSignUpClick = useCallback(() => {
        if(email.length === 0) setAlertText("Email Required");
        else if(password.length === 0) setAlertText("Password Required");
        else if(password.length < 6) setAlertText("Password to short 6");
        else if(confirmPassword !== password) setAlertText("Password Don't Match");
        else{            
            auth.createUserWithEmailAndPassword(email, password)            
            .catch(err => setAlertText(err.message))            
        }
    },[confirmPassword, password, email.length]);

    const onDismiss = useCallback(() => setAlertText(''), []);

   return(
    <IonPage>
        <IonHeader>
            <IonToolbar>
                <IonButtons slot="start">
                    <IonButton color="primary" routerLink="/login">
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
                    <IonInput onIonChange={onEmailNameChange}
                    type="email"
                    value={email}
                    ></IonInput>
                </IonItem>
                <br/>
                <IonItem>
                    <IonLabel position="floating">Password</IonLabel>
                    <IonInput onIonChange={onPasswordChange}
                    type="password"
                    value={password}
                    >                        
                    </IonInput>
                </IonItem>
                <br/>
                <IonItem>
                    <IonLabel position="floating">Confirm Password </IonLabel>
                    <IonInput onIonChange={onConfirmPasswordChange}
                    value={confirmPassword}
                    type="password" ></IonInput>
                </IonItem> 
                <br/>
                <div className="SignInButton">
                    <IonButton  onClick={onSignUpClick}>
                        Register
                    <IonIcon icon={personAddOutline}/>
                    </IonButton>
                </div>

            </IonGrid>
            <IonAlert
                isOpen={alertText.length > 0}
                onDidDismiss={onDismiss}
                message={alertText}
                buttons={['OK']}

            />
        </IonContent>
    </IonPage>
);
};

  export default Register;
  