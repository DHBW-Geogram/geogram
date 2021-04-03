import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { ellipse, square, triangle } from 'ionicons/icons';
import Tab1 from './pages/Tab1';
import Tab2 from './pages/Tab2';
import Tab3 from './pages/Tab3';
import Login from './pages/Login';
import Register from './pages/Register';
import MainTabs from './pages/MainTabs';
import FirstPage from './pages/FirstPage';

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




const PrivateRoutes = () => {
  return (
    <IonReactRouter>
      <IonRouterOutlet>
        {/****** AUTH CREATE ACCOUNT */}
        <Route path="/login" component={Login} exact={true} />
        <Route path="/register" component={Register} exact={true} />
        <Route path="/" render={() => <Redirect to="/login" />} />
      </IonRouterOutlet>
    </IonReactRouter>
  );
};
const PublicRoutes = () => {
  return (
    <IonReactRouter>
      <Route path="/tabs" component={MainTabs} />
      <Route path="/" render={() => <Redirect to="/tabs/home" />} />
    </IonReactRouter>
  );
};




const App: React.FC = () => {   
  
  return(
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        <Route  exact path="/firstPage" component={FirstPage}/>
        <Route  exact path="/login" component={Login}/>
        <Route  exact path="/register" component={Register}/>
        <Route  exact path="/mainTabs" component={MainTabs}/>
          
        <Route exact path="/" render={() => <Redirect to="/firstPage" />} />
      </IonRouterOutlet>      
    </IonReactRouter>    
  </IonApp>
);
};

export default App;
