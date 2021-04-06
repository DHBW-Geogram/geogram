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
} from "@ionic/react";
import { db } from "../helper/firebase";
import { Picture } from "../model/Picture";

const Search: React.FC = () => {
  const [searchText, setSearchText] = useState("");

  const [allPictures, setAllPictures] = useState<Array<Picture>>([]);
  const [filteredPictures, setFilteredPictures] = useState<Array<Picture>>([]);

  useEffect(() => {
    let ref = db.collection("images");

    let unsubscribe = ref.onSnapshot((querySnapshot: any) => {
      let typedDocs: Picture[] = [];
      querySnapshot.forEach((doc: any) => typedDocs.push(doc.data()));
      setAllPictures(typedDocs);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  function filterItems() {
    setFilteredPictures(
      allPictures.filter((picture: Picture) =>
        picture.title.startsWith(searchText)
      )
    );
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
          value={searchText}
          onIonChange={(e) => {
            setSearchText(e.detail.value!);
            {filterItems.bind(this)};
          }}
          showCancelButton="never"
        ></IonSearchbar>
        <IonList>
          {filteredPictures.map((picture: Picture) => {
            return <IonItem>{picture.title}</IonItem>;
          })}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Search;
