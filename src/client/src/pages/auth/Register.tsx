import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonButton,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonGrid,
  IonAlert,  
} from "@ionic/react";
import { chevronBackOutline, personAddOutline } from "ionicons/icons";
import React, { useCallback, useState } from "react";
import { db, auth } from "../../helper/firebase";
import "./Register.css";
import "firebase/auth";
import { PasswordCheckService } from "../../hooks/pwcheck";

import { User } from "../../model/User";
import { PasswordCheckStrength } from "../../hooks/pwcheck";
import { checkUsername } from "../../hooks/checkUsername";
import { checkRegister } from "../../hooks/register/checkRegister";
import { presentAlertWithHeader } from "../../hooks/alert";

const Register: React.FC = () => {
  const [email, setEmail] = useState("");
  const [userFirstName, setuserFirstName] = useState("");
  const [userLastName, setuserLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [alertText, setAlertText] = useState("");
  const [alertEmailVerify, setalertEmailVerify] = useState(false);
  const [pwStrength, setpwStrength] = useState(PasswordCheckStrength.Short);

  let checker: PasswordCheckService = new PasswordCheckService();

  const onEmailNameChange = useCallback((e) => setEmail(e.detail?.value), []);
  const onPasswordChange = useCallback((e) => {
    setPassword(e.detail?.value);
    setpwStrength(checker.checkPasswordStrength(e.detail?.value));
  }, []);

  const onConfirmPasswordChange = useCallback(
    (e) => setConfirmPassword(e.detail?.value),
    []
  );
  const onFirstNameChange = useCallback(
    (e) => setuserFirstName(e.detail?.value),
    []
  );
  const onLastNameChange = useCallback(
    (e) => setuserLastName(e.detail?.value),
    []
  );
  const onUsernameChange = useCallback((e) => setUserName(e.detail?.value), []);

  const onDismiss = useCallback(() => setAlertText(""), []);

  const onSignUpClick = useCallback(async () => {
    var alertMessage = await checkRegister(
      confirmPassword,
      password,
      email,
      userFirstName,
      userLastName,
      userName
    );

    if(auth.currentUser){
    presentAlertWithHeader("Please verify your email address to finish signing up for Geogram", "Thank you for signing in.");
    }
    
  }, [confirmPassword, password, email, userFirstName, userLastName, userName]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton color="primary" routerLink="/login">
              <IonIcon icon={chevronBackOutline} />
            </IonButton>
          </IonButtons>
          <IonTitle>Register</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonGrid>
          <br />
          <IonItem>
            <IonLabel position="floating">Username</IonLabel>
            <IonInput
              onIonChange={onUsernameChange}
              type="text"
              value={userName}
            ></IonInput>
          </IonItem>
          <br />
          <IonItem>
            <IonLabel position="floating">First Name</IonLabel>
            <IonInput
              onIonChange={onFirstNameChange}
              type="text"
              value={userFirstName}
            ></IonInput>
          </IonItem>
          <br />
          <IonItem>
            <IonLabel position="floating">Second Name</IonLabel>
            <IonInput
              onIonChange={onLastNameChange}
              type="text"
              value={userLastName}
            ></IonInput>
          </IonItem>
          <br />
          <IonItem>
            <IonLabel position="floating">Email</IonLabel>
            <IonInput
              onIonChange={onEmailNameChange}
              type="email"
              value={email}
            ></IonInput>
          </IonItem>
          <br />
          <IonItem>
            <IonLabel position="floating">Password {pwStrength}</IonLabel>
            <IonInput
              onIonChange={onPasswordChange}
              type="password"
              value={password}
            ></IonInput>
          </IonItem>
          <br />
          <IonItem>
            <IonLabel position="floating">Confirm Password </IonLabel>
            <IonInput
              onIonChange={onConfirmPasswordChange}
              value={confirmPassword}
              type="password"
            ></IonInput>
          </IonItem>
          <br />
          <div className="SignInButton">
            <IonButton onClick={onSignUpClick}>
              Register
              <IonIcon icon={personAddOutline} />
            </IonButton>
          </div>
        </IonGrid>
        {/* <IonAlert
          isOpen={alertText.length > 0}
          onDidDismiss={onDismiss}
          message={alertText}
          buttons={["OK"]}
        />
        <IonAlert
          isOpen={alertEmailVerify}
          onDidDismiss={() => setalertEmailVerify(false)}
          header={"Thank you for signing in."}
          message={
            "Please verify your email address to finish signing up for Geogram"
          }
          buttons={["OK"]}
        /> */}
      </IonContent>
    </IonPage>
  );
};

export default Register;
