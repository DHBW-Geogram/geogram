import { Redirect, Route } from 'react-router-dom';
import React, { useContext } from "react";
import {
  IonApp,
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
import MainTabs from './pages/auth/MainTabs';
import FirstPage from './pages/auth/FirstPage';
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
import { UserContext } from './helper/firebase';
import Tab1 from './pages/Tab1';
import Tab2 from './pages/Tab2';
import Tab3 from './pages/Tab3';



const App: React.FC = () => {   
  
  
 return(
   <IonApp>
    
     <IonReactRouter>
       <IonRouterOutlet>
         <Route  exact path="/home" component={FirstPage}/>
         <Route  exact path="/login" component={Login}/>
         <Route  exact path="/register" component={Register}/>
         <Route  exact path="/tabs"  component={MainTabs}/>
         <Route  exact path="/tab1" component={Tab1}/>
         <Route  exact path="/tab2" component={Tab2}/>
         <Route  exact path="/tab3" component={Tab3}/>
         {/* <Route exact path="/tabs" render={() => <Redirect to="/tab1" />} /> */}
        
         <Route exact path="/" render={() => <Redirect to="/home" />} />
       </IonRouterOutlet>      
     </IonReactRouter>    
   </IonApp>
 );
 };

export default App;


