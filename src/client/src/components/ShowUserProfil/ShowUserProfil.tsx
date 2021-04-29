import {
  IonAvatar,
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonImg,
  IonItem,
  IonLabel,
  IonModal,
  IonPage,
  IonPopover,
  IonRow,
  IonTitle,
  IonToolbar,
  useIonToast,
} from "@ionic/react";
import { chevronBackOutline, image } from "ionicons/icons";
import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { Image } from "../../model/Image";
import { auth, db } from "../../helper/firebase";
import "./ShowUserProfil.css";

interface ContainerProps {
  image: Image;
  active: boolean;
  setuserProfilModel: Dispatch<SetStateAction<boolean>>;
  setLoading?: Dispatch<SetStateAction<boolean>>;
}

const ShowUserProfil: React.FC<ContainerProps> = ({
  image,
  active,
  setuserProfilModel,
  setLoading,
}) => {
  const [username, setUsername] = useState<string>();
  const [firstName, setFirstName] = useState<string>();
  const [lastName, setLastName] = useState<string>();
  const [fullName, setFullName] = useState<string>();
  const [showPopup, setShowPopup] = useState(false);
  const [likes, setLikes] = useState<number>(0);
  const [flag, setFlag] = useState(false);
  let postsUsername: string = "";
  let counterLikes: number = 0;
  const [bio, setBio] = useState<string>();

  const [imageState, setImageState] = useState<string>("");
  let imageListCounter: string[] = [];
  let imageListListCounter: string[][] = [];
  const [imageList, setImageList] = useState<string[][]>([]);

  const [profilepic, setProfilepic] = useState(
    "https://im-coder.com/images4/15590312779219.png"
  );

  const [posts, setPosts] = useState<number>(0);

  useEffect(() => {
    db.collection("users")
      .where("username", "==", image.user)
      .get()
      .then(async (querySnapshot) => {
        querySnapshot.forEach(async (doc) => {
          if ((await doc.data().profilepic) != null) {
            setProfilepic(doc.data().profilepic);
          }
          setUsername(doc.data().username);
          setFirstName(doc.data().userFirstName);
          setLastName(doc.data().userLastName);
          setBio(doc.data().biography);
          setFullName(doc.data().userFirstName + " " + doc.data().userLastName);

          postsUsername = doc.data().username;
        });
      })
      .then(() => {
        db.collection("images")
          .where("user", "==", postsUsername)
          .get()
          .then((querySnapshot) => {
            setPosts(querySnapshot.size);

            counterLikes = 0;

            imageListCounter = [];

            querySnapshot.forEach((doc) => {
              if (!(doc.data().likes == null)) {
                counterLikes = counterLikes + doc.data().likes;
              }
              imageListCounter.push(doc.data().url as string);
            });
            setLikes(counterLikes);

            imageListListCounter = [];

            for (var i = 0; imageListCounter.length > 0; i++) {
              imageListListCounter[i] = [];
              for (var j = 0; j < 3; j++) {
                if (imageListCounter.length > 0) {
                  imageListListCounter[i].push(
                    imageListCounter.pop() as string
                  );
                }
              }
            }

            setImageList(imageListListCounter);
          });
      });
  }, []);

  const closeModal = useCallback(() => {
    setuserProfilModel(false);
  }, [false, setuserProfilModel]);

  return (
    <IonModal
      isOpen={active}
      cssClass="modal"
      onWillDismiss={() => setuserProfilModel(false)}
    >
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton color="primary" onClick={closeModal}>
              <IonIcon icon={chevronBackOutline} />
            </IonButton>
          </IonButtons>
          <IonTitle>{username}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonGrid>
          <IonRow>
            <IonCol>
              <IonItem>
                <IonAvatar
                  slot="start"
                  style={{ height: "100px", width: "100px" }}
                >
                  <IonImg src={profilepic} />
                </IonAvatar>

                <IonGrid>
                  <IonRow>
                    <IonCol style={{ textAlign: "center" }}>{likes}</IonCol>
                    <IonCol style={{ textAlign: "center" }}>{posts}</IonCol>
                  </IonRow>
                  <IonRow>
                    <IonCol style={{ textAlign: "center" }}>Likes</IonCol>
                    <IonCol style={{ textAlign: "center" }}>Beiträge</IonCol>
                  </IonRow>
                </IonGrid>
              </IonItem>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonItem>
                <IonGrid style={{ paddingLeft: "0px" }}>
                  <IonRow>
                    <IonCol>
                      <IonLabel style={{ fontSize: "20px" }}>
                        {fullName}
                      </IonLabel>
                    </IonCol>
                  </IonRow>
                  <IonRow>
                    <IonCol>
                      <IonLabel
                        className="ion-text-wrap"
                        style={{ fontSize: "15px" }}
                      >
                        {bio}
                      </IonLabel>
                    </IonCol>
                  </IonRow>
                </IonGrid>
              </IonItem>
            </IonCol>
          </IonRow>
        </IonGrid>
        <IonRow>
          <IonGrid>
            {imageList.map((image, id) => {
              return (
                <IonRow key={id}> 
                  {image.map((img, id) => {
                    return (
                      <IonCol size="4" key={id}>
                        <IonImg
                          src={img}
                          style={{ height: "100%", objectFit: "cover" }}
                          onClick={() => {
                            setImageState(img as string);
                          }}
                        />
                      </IonCol>
                    );
                  })}
                </IonRow>
              );
            })}
          </IonGrid>
        </IonRow>
      </IonContent>
    </IonModal>
  );
};

export default ShowUserProfil;
