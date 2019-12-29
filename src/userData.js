import React, { useState, useCallback, useEffect, useContext } from "react";
import shortid from "shortid";

import { useAuth } from "./auth";

import firebase from "./firebase";
import { Notification } from "./notifications";

const storage = firebase.storage();

const userDataContext = React.createContext();

function useLoopList(type) {
  const auth = useAuth();
  const [loops, setLoops] = useState([]);
  const [newLoops, setNewLoops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const docs = await firebase
        .firestore()
        .collection("loops")
        .where("type", "==", type)
        .where("uid", "==", auth.user.uid)
        .where("createdAt", "<=", new Date())
        .orderBy("createdAt", "desc")
        .get();

      setLoading(false);
      setLoops(parseDocs(docs));
    };

    fetchData();
  }, []);

  useEffect(() => {
    let unsubscribe;

    const subscribe = () => {
      unsubscribe && unsubscribe();
      unsubscribe = firebase
        .firestore()
        .collection("loops")
        .where("type", "==", type)
        .where("uid", "==", auth.user.uid)
        .where("createdAt", ">", new Date())
        .orderBy("createdAt", "desc")
        .onSnapshot(docs => {
          setNewLoops(newLoops => [...parseDocs(docs), ...newLoops]);
          docs.size && subscribe();
        });
    };

    subscribe();

    return () => unsubscribe();
  }, []);

  const refresh = useCallback(() => {
    setNewLoops([]);
    setLoops([...newLoops, ...loops]);
  }, [loops, newLoops]);

  return {
    loops,
    newLoops,
    loading,
    refresh
  };
}

export function UserDataProvider({ children }) {
  const auth = useAuth();

  const [uploads, setUploads] = useState({});
  const inbox = useLoopList("incoming");
  const outbox = useLoopList("outgoing");

  const endUpload = path => {
    setUploads(({ ...uploads }) => {
      delete uploads[path];
      return uploads;
    });
  };

  const upload = useCallback(
    async (username, files) => {
      await Promise.all(
        files.map(async file => {
          const path = `loops/${
            auth.user.uid
          }/${username}/${shortid.generate()}/${file.name}`;
          const ref = storage.ref(path);

          setUploads(uploads => ({ ...uploads, [path]: true }));

          try {
            await ref.put(file);
          } catch (e) {
            endUpload(path);
          }
        })
      );
    },
    [auth]
  );

  useEffect(() => {
    if (Object.keys(uploads).length) {
      outbox.loops.forEach(loop => {
        if (uploads[loop.file.path]) {
          endUpload(loop.file.path);
        }
      });

      outbox.newLoops.forEach(loop => {
        if (uploads[loop.file.path]) {
          endUpload(loop.file.path);
        }
      });
    }
  }, [uploads, outbox.loops, outbox.newLoops]);

  const value = {
    upload,
    inbox,
    outbox
  };

  return (
    <userDataContext.Provider value={value}>
      {!!Object.keys(uploads).length && (
        <Notification>
          Sending {Object.keys(uploads).length} loops...
        </Notification>
      )}
      {children}
    </userDataContext.Provider>
  );
}

export function useUserData() {
  return useContext(userDataContext);
}

function parseDocs(docs) {
  const data = [];
  docs.forEach(doc =>
    data.push({
      id: doc.id,
      ...doc.data()
    })
  );
  return data;
}
