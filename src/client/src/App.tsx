import { Redirect, Route } from "react-router-dom";
import React, { useContext, useState } from "react";
import Upload from "./pages/Upload/Upload";
import {
  IonAlert,
  IonApp,
  IonFab,
  IonFabButton,
  IonIcon,
  IonLabel,
  IonLoading,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from "@ionic/react";
import { IonReactHashRouter } from "@ionic/react-router";
import {
  cameraOutline,
  cameraSharp,
  personCircleOutline,
  search,
  home,
} from "ionicons/icons";
import Profile from "./pages/Profile/Profile";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";

import { UserContext } from ".";
import UploadSelectionModal from "./components/UploadSelectionModal/UploadSelectionModal";
import Search from "./pages/Search/Search";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Exploration from "./pages/Exploration/Exploration";
import ProfilePic from "./pages/ProfilePic/ProfilePic";
import { auth } from "./helper/firebase";

const PublicRoutes = () => {
  return (
    <IonReactHashRouter>
      <Route path="/login" component={Login} exact={true} />
      <Route path="/register" component={Register} exact={true} />
      <Route path="/" render={() => <Redirect to="/login" />} />
    </IonReactHashRouter>
  );
};

const PrivateRoutes = () => {
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showAlertNotVerified, setShowAlertNotVerified] = useState(false);
  const [temp, setTemp] = useState<number>(0);

  return (
    <IonReactHashRouter>
      <IonTabs>
        <IonRouterOutlet>
          <Route exact path="/explore">
            <Exploration
              temp={temp}
              setTemp={setTemp}
              setLoading={setLoading}
            />
          </Route>
          <Route exact path="/search">
            <Search temp={temp} setTemp={setTemp} />
          </Route>
          <Route path="/profile">
            <Profile setLoading={setLoading} />
          </Route>
          <Route exact path="/">
            <Redirect to="/explore" />
          </Route>

          <Route
            path="/upload"
            render={(props) => <Upload {...props} setLoading={setLoading} />}
          />
          <Route
            path="/profile-pic"
            render={(props) => (
              <ProfilePic {...props} setLoading={setLoading} />
            )}
          />

          <Route exact path="/login">
            <Redirect to="/explore" />
          </Route>
          <Route exact path="/register">
            <Redirect to="/explore" />
          </Route>
        </IonRouterOutlet>
        <IonTabBar slot="bottom">
          {/* Explore Tab - Benita */}
          <IonTabButton tab="explore" href="/explore">
            <IonIcon icon={home} />
            <IonLabel>Explore</IonLabel>
          </IonTabButton>
          {/* Search Tab - Benita */}

          <IonTabButton tab="search" href="/search">
            <IonIcon icon={search} />
            <IonLabel> Search</IonLabel>
          </IonTabButton>

          {/* Profile Tab - Jonas */}
          <IonTabButton tab="profile" href="/profile">
            <IonIcon icon={personCircleOutline} />
            <IonLabel>Profile</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>

      {/* Upload Component - Paul */}
      {true && (
        <>
          <IonFab
            style={{ marginBottom: "4.5rem", marginRight: "0.5rem" }}
            vertical="bottom"
            horizontal="end"
            slot="fixed"
            onClick={() => {
              if (auth.currentUser?.emailVerified) {
                setShowActionSheet(true);
              } else {
                setShowAlertNotVerified(true);
              }
            }}
          >
            <IonFabButton>
              <IonIcon md={cameraSharp} ios={cameraOutline} />
            </IonFabButton>
          </IonFab>
          <UploadSelectionModal
            active={showActionSheet}
            setShowActionSheet={setShowActionSheet}
            setLoading={setLoading}
          />
          <IonAlert
            isOpen={showAlertNotVerified}
            onDidDismiss={() => {
              setShowAlertNotVerified(false);
            }}
            header={"Email not verified"}
            message={"You need to verify your email to upload images."}
            buttons={["OK"]}
          />
        </>
      )}

      <IonLoading
        isOpen={loading}
        onDidDismiss={() => setLoading(false)}
        message={"Please wait..."}
        duration={5000}
      />
    </IonReactHashRouter>
  );
};

const App: React.FC = () => {
  const user = useContext(UserContext);

  return <IonApp> {user ? <PrivateRoutes /> : <PublicRoutes />}</IonApp>;
};

export default App;
