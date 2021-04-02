import {
  IonActionSheet
} from "@ionic/react";
import { cameraOutline, closeOutline, imageOutline } from "ionicons/icons";
import React, { Dispatch, SetStateAction, useState } from "react";
import { Redirect } from "react-router";
import { Photo, usePhotoGallery } from "../../hooks/usePhotoGallery";


const UploadSelectionModal: React.FC<{active: boolean, setShowActionSheet: Dispatch<SetStateAction<boolean>>}> = ({active, setShowActionSheet}) => {

  const [selectedRoute, setSelectedRoute] = useState("");
  const [image, setImage] = useState<Photo>();
  
  const { takePhoto } = usePhotoGallery();

  return (
      <>

        {
            selectedRoute === "upload" && <Redirect to={{
                pathname: "/upload",
                state: { image }
            }}/>
        }

        <IonActionSheet
            isOpen={active}
            onDidDismiss={() => setShowActionSheet(false)}
            buttons={[
            {
                text: "Camera",
                icon: cameraOutline,
                handler: () => {
                    takePhoto()
                    .then(image => {
                        // User took image
                        setImage(image);
                        setSelectedRoute("upload")
                    })
                    .catch(err => {
                        // User Aborted Camera
                        console.log(err)
                    })
                },
            },
            // {
            //     text: "Galerie",
            //     icon: imageOutline,
            //     handler: () => {
            //         setSelectedRoute("galerie")
            //     },
            // },
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
