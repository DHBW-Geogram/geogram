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
import {
  chevronBackOutline,
  eyeOutline,
  personAddOutline,
} from "ionicons/icons";
import React, { useCallback, useState } from "react";
import { auth } from "../../helper/firebase";
import "./Register.css";
import "firebase/auth";
import { PasswordCheckService } from "../../hooks/pwcheck";

import { PasswordCheckStrength } from "../../hooks/pwcheck";
import { checkRegister } from "../../hooks/register/checkRegister";
import { presentAlertWithHeader } from "../../hooks/alert";
import { hideShowPassword } from "../../hooks/hideShowPassword";

const Register: React.FC = () => {
  const [email, setEmail] = useState("");
  const [userFirstName, setuserFirstName] = useState("");
  const [userLastName, setuserLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [passwordShowHideIcon, setPasswordShowHideIcon] = useState(eyeOutline);
  const [passwordType, setpasswordType] = useState<any>("password");
  const [
    passwordConfirmShowHideIcon,
    setPasswordConfirmShowHideIcon,
  ] = useState(eyeOutline);
  const [passwordConfirmType, setpasswordConfirmType] = useState<any>(
    "password"
  );
  const [pwStrength, setpwStrength] = useState(PasswordCheckStrength.Notset);

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

  const onhideShowPasswordClick = useCallback(async () => {
    var a: any[] = await hideShowPassword(passwordType);
    setpasswordType(a[0]);
    setPasswordShowHideIcon(a[1]);
  }, [passwordType]);

  const onhideShowPasswordConfirmClick = useCallback(async () => {
    var a: any[] = await hideShowPassword(passwordConfirmType);
    setpasswordConfirmType(a[0]);
    setPasswordConfirmShowHideIcon(a[1]);
  }, [passwordConfirmType]);

  const onSignUpClick = useCallback(async () => {
    await checkRegister(
      confirmPassword,
      password,
      email,
      userFirstName,
      userLastName,
      userName
    );

    if (auth.currentUser) {
      presentAlertWithHeader(
        "Please verify your email address to finish signing up for Geogram",
        "Thank you for signing in."
      );
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
            <IonLabel position="floating">Last Name</IonLabel>
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
            <IonLabel position="floating">
              <div style={{color:"red"}}>{pwStrength}</div>
            </IonLabel>
            <IonInput
              onIonChange={onPasswordChange}
              type={passwordType}
              value={password}
            ></IonInput>
            <IonIcon className="LookIcon"
              slot="end"
              icon={passwordShowHideIcon}
              onClick={onhideShowPasswordClick}
            />
          </IonItem>
          <br />
          <IonItem>
            <IonLabel position="floating">Confirm Password </IonLabel>
            <IonInput
              onIonChange={onConfirmPasswordChange}
              value={confirmPassword}
              type={passwordConfirmType}
            ></IonInput>
            <IonIcon className="LookIcon"
              slot="end"
              icon={passwordConfirmShowHideIcon}
              onClick={onhideShowPasswordConfirmClick}
            />
          </IonItem>
          <br />
          <div className="SignInButton">
            <IonButton onClick={onSignUpClick}>
              Register
              <IonIcon icon={personAddOutline} />
            </IonButton>
          </div>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Register;
