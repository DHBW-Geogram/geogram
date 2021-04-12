import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonInput,
  IonButton,
  IonItem,
  IonLabel,
  IonIcon,
  IonGrid,
  IonAlert,
  IonRouterLink,
} from "@ionic/react";
import { 
  logInOutline  
} from "ionicons/icons";
import React, { useCallback, useState } from "react";
import "./Login.css";
import { auth } from "../../helper/firebase";

import "firebase/auth";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alertText, setAlertText] = useState("");
  const [alertPasswordForgotenText, setalertPasswordForgotenText] = useState(
    false
  );  

  const onEmailNameChange = useCallback((e) => setEmail(e.detail?.value), []);
  const onPasswordChange = useCallback((e) => setPassword(e.detail?.value), []);

  const onLoginClick = useCallback(() => {
    if (email.length === 0) setAlertText("Email Required");
    else if (password.length === 0) setAlertText("Password Required");
    else {
      auth
        .signInWithEmailAndPassword(email, password)
        .catch((err) => setAlertText(err.message));
    }
  }, [email.length, password.length]);

  const onDismiss = useCallback(() => setAlertText(""), []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>          
          <IonTitle>Login</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonGrid>
          <br />
          <IonItem>
            <IonLabel position="floating">Email</IonLabel>
            <IonInput
              onIonChange={onEmailNameChange}
              value={email}
              class="input"
              type="email"
            ></IonInput>
          </IonItem>
          <br />
          <IonItem>
            <IonLabel position="floating">Password</IonLabel>
            <IonInput
              onIonChange={onPasswordChange}
              value={password}
              type="password"
            ></IonInput>
          </IonItem>
          <br />
          <div className="LogInButton">
            <IonButton onClick={onLoginClick} expand="block">
              Login
              <IonIcon icon={logInOutline} />
            </IonButton>
          </div>
          <br />
          <br />
          <br />
          <div className="LogInButton">
            <IonRouterLink routerLink={"/register"}>
              CREAT A NEW ACCOUNT
            </IonRouterLink>
          </div>
          <br />
          <div className="LogInButton">
            <IonRouterLink onClick={() => setalertPasswordForgotenText(true)}>
              I FORGOT MY PASSWORD
            </IonRouterLink>
          </div>
        </IonGrid>
      </IonContent>
      <IonAlert
        isOpen={alertText.length > 0}
        onDidDismiss={onDismiss}
        message={alertText}
        buttons={["OK"]}
      />
      <IonAlert
        isOpen={alertPasswordForgotenText}
        onDidDismiss={() => setalertPasswordForgotenText(false)}
        message={"Please Type In your Email"}
        inputs={[
          {
            name: "emailPasswordForgoten",
            type: "email",
            placeholder: "Email",
          },
        ]}
        buttons={[
          {
            text: "OK",
            handler: (data) => {
              auth.sendPasswordResetEmail(data.emailPasswordForgoten);
            },
          },
        ]}
      />
    </IonPage>
  );
};
export default Login;
