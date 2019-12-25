import React, { useContext, useEffect, useState } from "react";
import firebase from "./firebase";

const defaultValue = {
  user: null,
  account: null,
  loading: true
};

const authContext = React.createContext({ ...defaultValue });

export function AuthProvider(props) {
  const [value, setValue] = useState({ ...defaultValue });

  useEffect(() => {
    let unsubscribe;

    return firebase.auth().onAuthStateChanged(user => {
      if (!user) {
        unsubscribe && unsubscribe();

        setValue({
          user: null,
          account: null,
          loading: false
        });
      } else {
        unsubscribe = firebase
          .firestore()
          .collection("accounts")
          .doc(user.uid)
          .onSnapshot(doc => {
            setValue({
              user,
              account: doc.data(),
              loading: false
            });
          });
      }
    });
  }, []);

  return <authContext.Provider value={value} {...props} />;
}

export function useAuth() {
  return useContext(authContext);
}
