import ReactDOM from "react-dom";
import App from "./App";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import reportWebVitals from "./reportWebVitals";
import { defineCustomElements } from "@ionic/pwa-elements/loader";
import React, { createContext, useEffect, useState } from "react";
import firebase, { auth, db } from "./helper/firebase";

defineCustomElements(window);

export const UserContext = createContext<firebase.User | null>(null);

export const UserProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<firebase.User | null>(null);

  useEffect(() => {
    auth.onAuthStateChanged((userAuth) => {
      console.log(userAuth);

      db.collection("users")
        .doc(userAuth?.uid)
        .get()
        .then((user) => {
          console.log(user.data());

          if (
            user.data() === undefined &&
            userAuth?.displayName !== undefined &&
            userAuth?.email !== undefined
          ) {
            const data = {
              username: userAuth?.displayName,
              userFirstName: "",
              userLastName: "",
              email: userAuth?.email,
            };
            db.collection("users")
              .doc(userAuth?.uid)
              .set(data)
              .then(() => setUser(userAuth));
          } else {
            setUser(userAuth);
          }
        });
    });
  }, []);

  return <UserContext.Provider value={user}> {children} </UserContext.Provider>;
};

ReactDOM.render(
  <UserProvider>
    <App />
  </UserProvider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
