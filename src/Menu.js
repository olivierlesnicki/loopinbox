import React from "react";

import Canvas, { Body, Header } from "./Canvas";
import BackButton from "./BackButton";
import firebase from "./firebase";

import "./Menu.css";

export default function Menu() {
  const logout = () => {
    firebase.auth().signOut();
  };

  const cancel = () => {};

  const remove = () => {
    firebase.auth().currentUser.delete();
  };

  return (
    <Canvas className="Menu">
      <Header>
        <BackButton />
      </Header>
      <Body>
        <ul className="Menu-items">
          <li className="Menu-item">
            <button onClick={cancel}>Cancel membership</button>
          </li>
          <li className="Menu-item">
            <button onClick={remove}>Delete account</button>
          </li>
          <li className="Menu-item">
            <button onClick={logout}>Logout</button>
          </li>
        </ul>
      </Body>
    </Canvas>
  );
}
