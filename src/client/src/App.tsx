import { Redirect, Route } from "react-router-dom";
import React, { useContext, useState } from "react";
import Upload from "./pages/Upload/Upload";
import {
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
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { arrowForwardCircle, cameraOutline, cameraSharp, ellipse, square, triangle,  personCircleOutline, search, home, squareOutline,} from 'ionicons/icons';
import Profile from './pages/Profile/Profile';


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
import Explore from "./pages/Explore";
import Search from "./pages/Search";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

const PublicRoutes = () => {
  return (
    <IonReactRouter>         
      <Route path="/login" component={Login} exact={true} />
      <Route path="/register" component={Register} exact={true} />
      <Route path="/" render={() => <Redirect to="/login" />} />
    </IonReactRouter>
  );
};

const PrivateRoutes = () => {
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [loading, setLoading] = useState(false);

  return (
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
          <Route exact path="/explore">
            <Explore />
          </Route>
          <Route exact path="/search">
            <Search />
          </Route>
          <Route path="/profile">
            <Profile />
          </Route>
          <Route exact path="/">
            <Redirect to="/explore" />
          </Route>

          <Route path="/upload" render={(props) => <Upload {...props} setLoading={setLoading} />} />
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
            <IonLabel>Search</IonLabel>
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
              setShowActionSheet(true);
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
        </>
      )}

      <IonLoading
        isOpen={loading}
        onDidDismiss={() => setLoading(false)}
        message={"Please wait..."}
        duration={5000}
      />
    </IonReactRouter>
  );
};

const App: React.FC = () => {
  const user = useContext(UserContext);

  return <IonApp>{user ? <PrivateRoutes /> : <PublicRoutes />}</IonApp>;
};

export default App;
