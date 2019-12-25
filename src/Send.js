import React, { useCallback, useState } from "react";
import { useHistory } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import pretty from "pretty-bytes";
import firebase from "firebase";
import _ from "lodash";

import shortid from "shortid";

import { useAuth } from "./auth";
import { useUserData } from "./userData";
import Button from "./Button";
import TextBox from "./TextBox";

import "./Send.css";

const storage = firebase.storage();

export default () => {
  const [username, setUsername] = useState("");
  const [progress, setProgress] = useState(null);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const auth = useAuth();
  const { upload } = useUserData();

  const onDrop = useCallback(acceptedFiles => {
    setFiles(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "audio/*"
  });

  const changeUsername = e => setUsername(e.target.value);
  const back = () => history.replace("/");

  const submit = useCallback(() => {
    upload(username, files);
    history.replace("/");
  }, [upload, username, files]);

  return (
    <div className="Modal">
      <button className="Modal-Back" onClick={back}>
        <ion-icon name="arrow-round-back"></ion-icon>
      </button>
      <div className="Modal-Header">
        <div className="Modal-Title">Send</div>
        <div className="Modal-Subtitle">Send a loop</div>
      </div>
      <TextBox
        placeholder="To: Instagram username"
        onChange={changeUsername}
        value={username}
        disabled={loading}
      />
      <div className="Send-dropzone" {...getRootProps()}>
        {!files.length ? (
          <div className="Send-dropzone-splash">
            <ion-icon name="add"></ion-icon> Add your loops
            <input {...getInputProps()} />
          </div>
        ) : (
          <div className="Send-dropzone-loops">
            {files.map(file => (
              <div className="Send-dropzone-loop">
                <div className="Send-dropzone-loop-name">{file.name}</div>
                <div className="Send-dropzone-loop-metadata">
                  {pretty(file.size)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="Modal-ActionBar">
        <Button
          onClick={submit}
          disabled={!username || loading || !files.length}
        >
          Send
        </Button>
      </div>
    </div>
  );
};
