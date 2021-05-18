import { IonActionSheet } from "@ionic/react";
import { cameraOutline, closeOutline, imageOutline } from "ionicons/icons";
import React, { Dispatch, SetStateAction, useState } from "react";
import { Redirect } from "react-router";
import { Photo, usePhotoGallery } from "../../hooks/usePhotoGallery";

const ProfilePicSelectionModal: React.FC<{
  active: boolean;
  setShowActionSheet: Dispatch<SetStateAction<boolean>>;
  setLoading: Dispatch<SetStateAction<boolean>>;
}> = ({ active, setShowActionSheet, setLoading }) => {
  const [selectedRoute, setSelectedRoute] = useState("");
  const [image, setImage] = useState<Photo>();

  const { takePhoto, takePhotoFromGalerie } = usePhotoGallery();

  return (
    <>
      {selectedRoute === "profile-pic" && (
        <Redirect
          to={{
            pathname: "/profile-pic",
            state: { image },
          }}
        />
      )}

      <IonActionSheet
        isOpen={active}
        onDidDismiss={() => setShowActionSheet(false)}
        buttons={[
          {
            text: "Camera",
            icon: cameraOutline,
            handler: () => {
              takePhoto()
                .then((image) => {
                  // User took image
                  setLoading(true);
                  setImage(image);
                  setSelectedRoute("profile-pic");
                })
                .catch((err) => {
                  // User Aborted Camera
                  console.log(err);
                });
            },
          },
          {
            text: "Galerie",
            icon: imageOutline,
            handler: () => {
              takePhotoFromGalerie().then((image) => {
                setLoading(true);
                setImage(image);
                setSelectedRoute("profile-pic");
              });
            },
          },
          {
            text: "Close",
            icon: closeOutline,
            handler: () => {
              setShowActionSheet(false);
            },
          },
        ]}
      ></IonActionSheet>
    </>
  );
};

export default ProfilePicSelectionModal;
