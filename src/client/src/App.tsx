import { Redirect, Route } from 'react-router-dom';
import React, { useContext, useState } from "react";
import Upload from './pages/Upload/Upload';
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
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import FirstPage from './pages/auth/FirstPage';
import { arrowForwardCircle, cameraOutline, cameraSharp, ellipse, square, triangle } from 'ionicons/icons';
import Tab1 from './pages/Tab1';
import Tab2 from './pages/Tab2';
import Tab3 from './pages/Tab3';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';

import { UserContext } from '.';
import UploadSelectionModal from './components/UploadSelectionModal/UploadSelectionModal';


const PublicRoutes = () => {
  return (
    <IonReactRouter>
    
        {/****** AUTH CREATE ACCOUNT */}
        <Route path="/home" component={FirstPage} exact={true} />
        <Route path="/login" component={Login} exact={true} />
        <Route path="/register" component={Register} exact={true} />
        <Route path="/" render={() => <Redirect to="/home" />} />
      
    </IonReactRouter>
  );
};

const PrivateRoutes = () => {
  const [showActionSheet, setShowActionSheet] = useState(false);
  return (
    <IonReactRouter>
        <IonTabs>
          <IonRouterOutlet>
            <Route exact path="/tab1">
              <Tab1 />
            </Route>
            <Route exact path="/tab2">
              <Tab2 />
            </Route>
            <Route path="/tab3">
              <Tab3 />
            </Route>
            <Route exact path="/">
              <Redirect to="/tab1" />
            </Route>
            
            <Route path="/upload" render={(props) => <Upload {...props}/>}/>
            <Route exact path="/login">
                <Redirect to="/tab1" />
              </Route> 
              <Route exact path="/register">
                <Redirect to="/tab1" />
              </Route> 
              <Route exact path="/home">
                <Redirect to="/tab1" />
              </Route> 
          </IonRouterOutlet>
          <IonTabBar slot="bottom">
            {/* Explore Tab - Benita */}
            <IonTabButton tab="tab1" href="/tab1">
              <IonIcon icon={triangle} />
              <IonLabel>Explore</IonLabel>
            </IonTabButton>
            {/* Search Tab - Benita */}
            <IonTabButton tab="tab2" href="/tab2">
              <IonIcon icon={ellipse} />
              <IonLabel>Search</IonLabel>
            </IonTabButton>
            {/* Profile Tab - Jonas */}
            <IonTabButton tab="tab3" href="/tab3">
              <IonIcon icon={square} />
              <IonLabel>User</IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>

            {/* Upload Component - Paul */}
            {
              true &&
              <>
                  <IonFab style={{marginBottom: "4.5rem", marginRight: "0.5rem"}} vertical="bottom" horizontal="end" slot="fixed" onClick={ () => {setShowActionSheet(true)}}>
                    <IonFabButton>
                      <IonIcon md={cameraSharp} ios={cameraOutline} />
                    </IonFabButton>
                  </IonFab>
                  <UploadSelectionModal active={showActionSheet} setShowActionSheet={setShowActionSheet}/>
              </>
            }

      </IonReactRouter>
  );
};




const App: React.FC = () => {   

    const user = useContext(UserContext);
    
 return(
   <IonApp>

    {user ? <PrivateRoutes /> : <PublicRoutes />}

  
   </IonApp>
 );
 };

export default App;


