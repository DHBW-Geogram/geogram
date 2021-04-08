
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonIcon, IonInput, IonItem, IonLabel, IonGrid, IonRow, IonAlert } from "@ionic/react";
import { chevronBackOutline, personAddOutline } from "ionicons/icons";
import React, {useCallback, useState} from "react";
import { fb, db, auth } from "../../helper/firebase";
import './Register.css'
import "firebase/auth";
import { useHistory, useLocation } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../..";
import firebase from "firebase";



const Register: React.FC = () => {

    const [email, setEmail] = useState("");
    const [userFirstName, setuserFirstName] = useState('');
    const [userLastName, setuserLastName] = useState('');    
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [alertText, setAlertText] = useState('')
    
    const user = useContext(UserContext);
  

   const onEmailNameChange = useCallback((e) =>
   setEmail(e.detail?.value), []);
   const onPasswordChange = useCallback((e) =>
   setPassword(e.detail?.value), []);
   const onConfirmPasswordChange = useCallback((e) =>
   setConfirmPassword(e.detail?.value), []);
   const onFirstNameChange = useCallback((e) =>
   setuserFirstName(e.detail?.value), []);
   const onLastNameChange = useCallback((e) =>
   setuserLastName(e.detail?.value), []);
   



    const onSignUpClick = useCallback(() => {
        if(email.length === 0) setAlertText("Email Required");
        else if(password.length === 0) setAlertText("Password Required");
        else if(password.length < 6) setAlertText("Password to short 6");
        else if(userLastName.length === 0) setAlertText("Secondname Required");
        else if(userFirstName.length === 0) setAlertText("Firstname Required");
        else if(confirmPassword !== password) setAlertText("Password Don't Match");
        else{            
            auth.createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                
                var user = userCredential.user;

               
                 user?.sendEmailVerification();
                //TODO:alert email verification

                //Setup firestore data
                const data = {
                  grid: [user?.uid],
                  userFirstName: userFirstName,
                  userLastName: userLastName,
                  email: email,                  
                };
        
                db.collection("users")
                  .doc(auth.currentUser?.uid)
                  .set(data)
                   .catch(err => setAlertText(err.message));
              })                 
            .catch(err => setAlertText(err.message));        

             
        }
    },[confirmPassword, password, email.length, userFirstName, userLastName, email]);

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
                    <IonInput onIonChange={onFirstNameChange}
                    type="text"
                    value={userFirstName}>  
                    </IonInput>
                </IonItem>
                <br/>
                <IonItem>
                    <IonLabel position="floating">Second Name</IonLabel>
                    <IonInput onIonChange={onLastNameChange}
                    type="text"
                    value={userLastName}>                        
                    </IonInput>
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
  