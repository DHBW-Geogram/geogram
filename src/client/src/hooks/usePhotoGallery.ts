import { useState, useEffect } from "react";
import { useCamera } from '@ionic/react-hooks/camera';
import { useFilesystem, base64FromPath } from '@ionic/react-hooks/filesystem';
import { useStorage } from '@ionic/react-hooks/storage';
import { isPlatform } from '@ionic/react';
import { CameraResultType, CameraSource, CameraPhoto, Capacitor, FilesystemDirectory } from "@capacitor/core";
import { Plugins } from '@capacitor/core';

const { Filesystem } = Plugins;

const PHOTO_STORAGE = "photos";

export function usePhotoGallery() {

  const [photo, setPhoto] = useState<Photo>();
  const { getPhoto } = useCamera();
  const { deleteFile, readFile, writeFile } = useFilesystem();
  const { get, set } = useStorage();

  useEffect(() => {


  }, [get, readFile]);
  

  const takePhoto = async (): Promise<Photo> => {
    // Access camera photo
    const cameraPhoto = await getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 15
    });
    // Create filename based on date
    const fileName = new Date().getTime() + '.jpeg';
    // Save image
    const savedFileImage = await savePicture(cameraPhoto, fileName);
    // Set image into state
    setPhoto(savedFileImage);
    // Store Image to storage
    set(PHOTO_STORAGE, JSON.stringify(savedFileImage));
    // return result
    return savedFileImage;
  };

  const convertBlobToBase64 = async(blob: Blob): Promise<string>  => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });
  }

  const takePhotoFromGalerie = async(): Promise<Photo> => {
      // Access galerie photo
      const cameraPhoto = await getPhoto({
        resultType: CameraResultType.Uri,
        source: CameraSource.Photos,
        quality: 25
      });
      // Create filename based on date
      const fileName = new Date().getTime() + '.jpeg';
      // Save image
      const savedFileImage = await savePicture(cameraPhoto, fileName);
      // Set image into state
      setPhoto(savedFileImage);
      // Store Image to storage
      set(PHOTO_STORAGE, JSON.stringify(savedFileImage));
      // return result
      return savedFileImage;
  }

  const savePicture = async (photo: CameraPhoto, fileName: string): Promise<Photo> => {
    let base64Data: string;
    // "hybrid" will detect Cordova or Capacitor;
    if (isPlatform('hybrid')) {
      const file = await readFile({
        path: photo.path!
      });
      base64Data = file.data;
    } else {
      base64Data = await base64FromPath(photo.webPath!);
    }
    const savedFile = await writeFile({
      path: fileName,
      data: base64Data,
      directory: FilesystemDirectory.Data
    });

    if (isPlatform('hybrid')) {
      // Display the new image by rewriting the 'file://' path to HTTP
      // Details: https://ionicframework.com/docs/building/webview#file-protocol
      return {
        filepath: savedFile.uri,
        webviewPath: Capacitor.convertFileSrc(savedFile.uri), 
      };
    }
    else {
      // Use webPath to display the new image instead of base64 since it's 
      // already loaded into memory
      return {
        filepath: fileName,
        webviewPath: photo.webPath,
        data: base64Data
      };
    }
  };


  // const download = async(path:string) => {
  //   const base64Data = await _readAsBase64(path);
  //   const fileName = `${new Date().getTime()}.jpeg`;
  //   // const image = await Filesystem.writeFile({
  //   //   path: fileName,
  //   //   data: base64Data,
  //   //   directory: FilesystemDirectory.Documents
  //   // });
  //   return base64Data;
  // }
  // const _readAsBase64 = async(url: string): Promise<string> => {
  //   const response = await fetch(url);
  //   const blob = await response.blob();
  //   return await _convertBlobToBase64(blob);
  // }
  // const _convertBlobToBase64 = async(blob: Blob): Promise<string> => {
  //   return new Promise((resolve, reject) => {
  //     const reader = new FileReader();
  //     reader.onerror = () => reject();
  //     reader.onload = () => resolve(reader.result as string);
  //     reader.readAsDataURL(blob);
  //   });
  // }

  return {
    photo,
    takePhoto,
    takePhotoFromGalerie,
    convertBlobToBase64
  };
}

export interface Photo {
  filepath: string;
  webviewPath?: string;
  data?: string;
}