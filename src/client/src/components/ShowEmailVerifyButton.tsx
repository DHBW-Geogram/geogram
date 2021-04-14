import { IonButton } from "@ionic/react";
import React from "react";
import { emailVerified, sendEmailVerify } from "../hooks/register/emailVerify";


const ShowEmailVerifyButton: React.FC =  () => {
      
    return(       
            <IonButton shape="round" onClick={() => sendEmailVerify()} fill="outline" color="danger">
                  Verify Email
            </IonButton>
            
          );   
}

export default ShowEmailVerifyButton;