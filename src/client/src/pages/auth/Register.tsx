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
  IonRow,
  IonAlert,
} from "@ionic/react";
import { chevronBackOutline, personAddOutline } from "ionicons/icons";
import React, { useCallback, useState } from "react";
import { fb, db, auth } from "../../helper/firebase";
import "./Register.css";
import "firebase/auth";
import { useHistory, useLocation } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../..";
import firebase from "firebase";
import { User } from "../../model/User";

const Register: React.FC = () => {
  const [email, setEmail] = useState("");
  const [userFirstName, setuserFirstName] = useState("");
  const [userLastName, setuserLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [alertText, setAlertText] = useState("");
  const [alertEmailVerify, setalertEmailVerify] = useState(false);

  const onEmailNameChange = useCallback((e) => setEmail(e.detail?.value), []);
  const onPasswordChange = useCallback((e) => setPassword(e.detail?.value), []);
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

  const usernameCheck = db.collection("users");
  //Check Username
  async function checkUsername(userName: any) {
    const data = await usernameCheck.get();
    let typedDocs: User[] = [];
    data.docs.forEach((doc: any) => typedDocs.push(doc.data().username));
    var len = typedDocs.length;

    for (var i = 0; i < len; i++) {
      if (typedDocs[i] === userName) {
        setAlertText("Username already taken");
        return true;
      }
    }
    return true;
  }

  const onSignUpClick = useCallback(async () => {
    if (userName.length === 0) setAlertText("Username Required");
    //Check Username
    var a = checkUsername(userName);
    if ((await a) === true)
      if (userFirstName.length === 0) setAlertText("Firstname Required");
      else if (userLastName.length === 0) setAlertText("Secondname Required");
      else if (email.length === 0) setAlertText("Email Required");
      else if (password.length === 0) setAlertText("Password Required");
      else if (password.length < 6) setAlertText("Password to short");
      else if (confirmPassword !== password)
        setAlertText("Password don't match");
      else {
        auth
          .createUserWithEmailAndPassword(email, password)
          .then((userCredential) => {
            var user = userCredential.user;
            user?.sendEmailVerification();

            setalertEmailVerify(true);

            //Setup firestore data
            const data = {
              username: userName,
              userFirstName: userFirstName,
              userLastName: userLastName,
              email: email,
            };

            db.collection("users")
              .doc(auth.currentUser?.uid)
              .set(data)
              .catch((err) => setAlertText(err.message));
          })
          .catch((err) => setAlertText(err.message));
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
            <IonLabel position="floating">Password</IonLabel>
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
        <IonAlert
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
        />
      </IonContent>
    </IonPage>
  );
};

export default Register;
