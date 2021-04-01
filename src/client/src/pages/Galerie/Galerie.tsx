import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';

const Galerie: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Galerie</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Galerie</IonTitle>
          </IonToolbar>
        </IonHeader>

    

      </IonContent>
    </IonPage>
  );
};

export default Galerie;
