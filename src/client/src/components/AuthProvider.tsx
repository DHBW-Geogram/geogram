
import React, { createContext, useEffect, useState } from "react";
import firebase, { fb, db, auth } from "../helper/firebase";





// type ContextProps = {
//     user: firebase.User | null;
//     authenticated: boolean;
//     setUser: any;
//     loadingAuthState: boolean;
// };
// export const AuthContext =     React.createContext<Partial<ContextProps>>({});
// export const AuthProvider = ({ children }: any) => {
//     const [user, setUser] = useState(null as firebase.User | null);
//     const [loadingAuthState, setLoadingAuthState] = useState(true);
// useEffect(() => {
//     auth.onAuthStateChanged((user: any) => {
//       setUser(user);
//       setLoadingAuthState(false);
//    });
// }, []);
// return (
//     <AuthContext.Provider
//      value={{
//           user,
//           authenticated: user !== null,
//           setUser,
//           loadingAuthState
//     }}>
//       {children} 
//    </AuthContext.Provider>
//   );
// }