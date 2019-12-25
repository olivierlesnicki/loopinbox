import React, { useCallback, useState } from "react";
import { useHistory } from "react-router-dom";
import shortid from "shortid";

import Button from "./Button";
import TextBox from "./TextBox";
import cloud from "./cloud";

import logo from "./logo.png";

export default () => {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const changeUsername = e => setUsername(e.target.value);

  const submit = useCallback(() => {
    const postData = async () => {
      setLoading(true);

      try {
        // Generate a salt
        const salt = shortid.generate();

        const data = await cloud("requestInstagramCode", { salt, username });

        // Navigate to /verify passing salt and account
        history.push("/verify", {
          salt,
          account: data.account
        });
      } catch (e) {
        setLoading(false);
      }
    };

    postData();
  }, [username, history]);

  return (
    <div className="Modal">
      <div className="Modal-Header">
        <img className="Modal-Logo" src={logo} alt="Loopinbox logo" />
        <div className="Modal-Title">Connect</div>
        <div className="Modal-Subtitle">
          Connect to Loopinbox with Instagram
        </div>
      </div>
      <TextBox
        placeholder="Instagram username"
        onChange={changeUsername}
        value={username}
        disabled={loading}
      />
      <div className="Modal-Helper">
        We will send a 6 digits verification code to your Instagram account by
        direct message.
      </div>
      <div className="Modal-ActionBar">
        <Button onClick={submit} disabled={!username || loading}>
          Next
        </Button>
      </div>
    </div>
  );
};
