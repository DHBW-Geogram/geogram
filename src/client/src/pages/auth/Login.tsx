import {
  IonPage,
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
  IonImg,
  IonRow,
  IonCol,
} from "@ionic/react";
import { eyeOutline, logInOutline } from "ionicons/icons";
import React, { useCallback, useState } from "react";
import "./Login.css";
import { auth } from "../../helper/firebase";
import icon from "../../assets/icon/icon.png";
import "firebase/auth";
import { checkLogin } from "../../hooks/login/checkLogin";
import { hideShowPassword } from "../../hooks/hideShowPassword";
import { presentAlert } from "../../hooks/alert";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordShowHideIcon, setPasswordShowHideIcon] = useState(eyeOutline);
  const [passwordType, setpasswordType] = useState<any>("password");
  const [alertPasswordForgotenText, setalertPasswordForgotenText] = useState(
    false
  );

  const onUsernameNameChange = useCallback(
    (e) => setUsername(e.detail?.value),
    []
  );
  const onPasswordChange = useCallback((e) => setPassword(e.detail?.value), []);

  const onhideShowPasswordClick = useCallback(async () => {
    var a: any[] = await hideShowPassword(passwordType);
    setpasswordType(a[0]);
    setPasswordShowHideIcon(a[1]);
  }, [passwordType]);

  const onLoginClick = useCallback(async () => {
    await checkLogin(username, password);
  }, [username, password]);

  return (
    <IonPage>
      <IonContent fullscreen>
       
        <IonTitle className="Title">Geogram</IonTitle>
     
        <IonGrid>
          <IonRow>
            <IonCol
              size="12"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <IonImg className="Icon" src={icon} />
            </IonCol>
          </IonRow>
        </IonGrid>
        <br />
        <IonGrid>
          <IonRow>
            <IonCol
              size="12"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <IonItem lines="none" className="inputField">
                <IonLabel position="floating">Email or Username</IonLabel>
                <IonInput
                  onIonChange={onUsernameNameChange}
                  value={username}
                  class="input"
                  type="text"
                ></IonInput>
              </IonItem>
            </IonCol>
          </IonRow>

          <IonRow>
            <IonCol
              size="12"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <IonItem lines="none" className="inputField">
                <IonLabel position="floating">Password</IonLabel>
                <IonInput
                  onIonChange={onPasswordChange}
                  value={password}
                  type={passwordType}
                ></IonInput>
                <IonIcon
                  className="LookIcon"
                  slot="end"
                  icon={passwordShowHideIcon}
                  onClick={onhideShowPasswordClick}
                />
              </IonItem>
            </IonCol>
          </IonRow>

          <div className="LogInButton">
            <IonRow>
              <IonCol
                size="12"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <IonButton onClick={onLoginClick} expand="block">
                  Login
                  <IonIcon icon={logInOutline} />
                </IonButton>
              </IonCol>
            </IonRow>
          </div>
        </IonGrid>
        <IonGrid>
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
              presentAlert(
                "A Passowrd reset Email was send to " +
                  data.emailPasswordForgoten +
                  "."
              );
            },
          },
        ]}
      />
    </IonPage>
  );
};
export default Login;
