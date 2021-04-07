import React, { useEffect, useState } from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonSearchbar,
  IonItem,
  IonList,
  IonChip,
  IonLabel,
  IonAvatar,
  IonIcon,
  IonListHeader,
} from "@ionic/react";
import { db } from "../helper/firebase";
import { Picture } from "../model/Picture";
import { responsesAreSame } from "workbox-broadcast-update";

const Search: React.FC = () => {
  const [allPictures, setAllPictures] = useState<Array<Picture>>([]);
  const [filteredPictures, setFilteredPictures] = useState<Array<Picture>>([]);
  const [locations, setLocations] = useState<Array<String>>([]);
  const [titles, setTitles] = useState<Array<String>>([]);
  const [users, setUsers] = useState<Array<Number>>([]);

  useEffect(() => {
    fetchImages();
    reset();
  }, []);

  const fetchImages = async () => {
    console.log(allPictures);
    const ref = db.collection("images");
    const data = await ref.get();
    let typedDocs: Picture[] = [];
    data.docs.forEach((doc: any) => typedDocs.push(doc.data()));
    setAllPictures(typedDocs);
  };

  function filterItems(searchText: string) {
    console.log("filtering");

    if (searchText === "" || searchText === null || searchText === undefined) {
      reset();
    }

    setLocations(
      allPictures
        .filter(
          (picture: Picture) =>
            picture.location.coords.latitude.toPrecision(2) === Number(searchText).toPrecision(2)
        )
        .map(
          (picture: Picture) =>
            picture.location.coords.latitude.toPrecision(4) +
            " " +
            picture.location.coords.longitude.toPrecision(4)
        )
    );
    setTitles(
      allPictures
        .filter((picture: Picture) => picture.title.startsWith(searchText))
        .map((picture: Picture) => picture.title)
    );
    setUsers(
      allPictures
        .filter((picture: Picture) => picture.user === Number(searchText))
        .map((picture: Picture) => picture.user)
    );
  }

  function reset() {
    console.log("resetting", allPictures);
    setLocations(
      allPictures.map(
        (picture: Picture) =>
          picture.location.coords.latitude.toPrecision(4) +
          " " +
          picture.location.coords.longitude.toPrecision(4)
      )
    );
    setTitles(allPictures.map((picture: Picture) => picture.title));
    setUsers(allPictures.map((picture: Picture) => picture.user));
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Search</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonSearchbar
          onIonChange={(e) => {
            {
              filterItems((e.target as HTMLInputElement).value);
            }
          }}
          showCancelButton="never"
        ></IonSearchbar>
        <IonListHeader>Locations</IonListHeader>
        {locations.map((location: String) => {
          return (
            <IonChip>
              <IonLabel>{location}</IonLabel>
            </IonChip>
          );
        })}
        <IonListHeader>Titles</IonListHeader>
        {titles.map((title: String) => {
          return (
            <IonChip>
              <IonLabel>{title}</IonLabel>
            </IonChip>
          );
        })}
        <IonListHeader>Users</IonListHeader>
        {users.map((user: Number) => {
          return (
            <IonChip>
              <IonLabel>{user}</IonLabel>
            </IonChip>
          );
        })}
      </IonContent>
    </IonPage>
  );
};

export default Search;
