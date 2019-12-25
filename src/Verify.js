import React, { useState } from "react";
import { useLocation, useHistory } from "react-router-dom";

import firebase from "./firebase";
import Button from "./Button";
import TextBox from "./TextBox";
import cloud from "./cloud";

import logo from "./logo.png";

import "./Verify.css";

export default () => {
  const history = useHistory();
  const { state } = useLocation();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  if (!state) {
    return history.goBack();
  }

  const changeCode = e => setCode(String(e.target.value));

  let account = state.account || {};
  let salt = state.salt || null;

  const back = () => history.goBack();

  const submit = () => {
    const postData = async () => {
      setLoading(true);

      try {
        // Send salt, code and account Id to /verifyInstagramCode
        const data = await cloud("verifyInstagramCode", {
          salt,
          code,
          accountId: String(account.id)
        });

        // Login
        const { customToken } = data;
        await firebase.auth().signInWithCustomToken(customToken);
      } catch (e) {
        setLoading(false);
      }
    };

    postData();
  };

  return (
    <div className="Modal">
      <button className="Modal-Back" onClick={back}>
        <ion-icon name="arrow-round-back"></ion-icon>
      </button>
      <div className="Modal-Header">
        <img className="Modal-Logo" src={logo} alt="Loopinbox logo" />
        <div className="Modal-Title">{account.fullName}</div>
        <div className="Verify-profile">
          <img
            className="Verify-profile-avatar"
            src={account.picture}
            alt={`@${account.username} profile`}
          />
          <div className="Verify-profile-username">@{account.username}</div>
        </div>
      </div>
      <TextBox
        placeholder="Verification code"
        value={code}
        onChange={changeCode}
        disabled={loading}
      />
      <div className="Modal-ActionBar">
        <Button onClick={submit} disabled={!code || loading}>
          Next
        </Button>
      </div>
    </div>
  );
};
