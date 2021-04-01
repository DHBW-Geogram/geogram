import {
  IonActionSheet
} from "@ionic/react";
import { cameraOutline, closeOutline, imageOutline } from "ionicons/icons";
import React, { Dispatch, SetStateAction, useState } from "react";
import { Redirect } from "react-router";
import { usePhotoGallery } from "../../hooks/usePhotoGallery";


const UploadSelectionModal: React.FC<{active: boolean, setShowActionSheet: Dispatch<SetStateAction<boolean>>}> = ({active, setShowActionSheet}) => {

  const [selectedRoute, setSelectedRoute] = useState("");
  
  const { takePhoto } = usePhotoGallery();

  return (
      <>

        {
            selectedRoute === "camera" && <Redirect to="/camera"/>
        }

        {
            selectedRoute === "galerie" && <Redirect to="/galerie"/>
        }

        <IonActionSheet
            isOpen={active}
            onDidDismiss={() => setShowActionSheet(false)}
            buttons={[
            {
                text: "Camera",
                icon: cameraOutline,
                handler: () => {
                    setSelectedRoute("camera")
                    takePhoto();
                },
            },
            {
                text: "Galerie",
                icon: imageOutline,
                handler: () => {
                    setSelectedRoute("galerie")
                },
            },
            {
                text: "Close",
                icon: closeOutline,
                handler: () => {
                setShowActionSheet(false)
                },
            }
            ]}
        ></IonActionSheet>
      </>
  );
};

export default UploadSelectionModal;
