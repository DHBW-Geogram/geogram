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
import { responsesAreSame } from "workbox-broadcast-update";

const Search: React.FC = () => {
  const [searchText, setSearchText] = useState("");

  const [allPictures, setAllPictures] = useState<Array<Picture>>([]);
  const [filteredPictures, setFilteredPictures] = useState<Array<Picture>>([]);

  useEffect(() => {
        fetchImages();
  }, []);

  const fetchImages=async() =>{
      console.log(allPictures);
    const ref = db.collection("images");
    const data = await ref.get();let typedDocs: Picture[] = [];
    data.docs.forEach((doc: any) => typedDocs.push(doc.data()));
    setAllPictures(typedDocs)
}

  function filterItems() {
      console.log("filtered",filteredPictures);
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
            {filterItems()};
          }}
          showCancelButton="never"
        ></IonSearchbar>
        <IonList>
          {filteredPictures.map((picture: Picture) => {
              console.log(allPictures);
            return <IonItem>{picture.title}</IonItem>;
          })}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Search;
