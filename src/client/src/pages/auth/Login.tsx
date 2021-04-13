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
import { checkLogin } from "../../hooks/login/checkLogin";
import { emailVerified } from "../../hooks/register/emailVerify";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");  
  const [alertPasswordForgotenText, setalertPasswordForgotenText] = useState(
    false
  );  

  const onUsernameNameChange = useCallback((e) => setUsername(e.detail?.value), []);
  const onPasswordChange = useCallback((e) => setPassword(e.detail?.value), []);

  const onLoginClick = useCallback(async () => {
    
    await checkLogin(username, password);   
  

  }, [username, password]);

  

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
            <IonLabel position="floating">Email or Username</IonLabel>
            <IonInput
              onIonChange={onUsernameNameChange}
              value={username}
              class="input"
              type="text"
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
              CREATE A NEW ACCOUNT
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
            text: "Send",
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
