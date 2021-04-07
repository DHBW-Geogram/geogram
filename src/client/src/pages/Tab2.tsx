import { IonButton, IonButtons, IonContent, IonHeader, IonItem, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { useCallback } from 'react';
import ExploreContainer from '../components/ExploreContainer';
import { auth } from '../helper/firebase';
import './Tab2.css';

const Tab2: React.FC = () => {



    const onSignOutClick = useCallback(() => {

    	 auth.signOut() 

      },[]);




  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tab 2</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Tab 2</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonItem>
        <IonButtons onClick={onSignOutClick} >Signout</IonButtons>
        </IonItem>
        <ExploreContainer name="Tab 2 page" />
      </IonContent>
    </IonPage>
  );
};

export default Tab2;



