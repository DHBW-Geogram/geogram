import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonIcon, IonImg, IonItem, IonLabel, IonText } from "@ionic/react";
import { pin } from "ionicons/icons";
import React from "react"
import { Image } from "../../model/Image";

interface ContainerProps {
  image: Image
}

const ExploreCard: React.FC<ContainerProps> = ({ image }) => {
  return (
    <IonCard>
    <IonItem>
      <IonIcon icon={pin} slot="start" />
      <IonLabel>
        {image.location.position
          ? image.location.position
          : image.location.coords.latitude +
            " " +
            image.location.coords.longitude}
      </IonLabel>
    </IonItem>
    <IonCardHeader>
      <IonCardSubtitle>{image.user}</IonCardSubtitle>
      <IonCardTitle>{image.title}</IonCardTitle>
    </IonCardHeader>

    <IonCardContent>
      <IonImg src={image.url}></IonImg>
      <br />
      <IonText>{image.description}</IonText>
    </IonCardContent>
  </IonCard>
  );
};

export default ExploreCard;
