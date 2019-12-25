import React from "react";

import Canvas, { Body, Header } from "./Canvas";
import BackButton from "./BackButton";
import firebase from "./firebase";

import "./Menu.css";

export default function Menu() {
  const logout = () => {
    firebase.auth().signOut();
  };

  return (
    <Canvas className="Menu">
      <Header>
        <BackButton />
      </Header>
      <Body>
        <ul className="Menu-items">
          <li className="Menu-item">
            <a href="">Cancel membership</a>
          </li>
          <li className="Menu-item">
            <a href="">Delete account</a>
          </li>
          <li className="Menu-item">
            <button onClick={logout}>Logout</button>
          </li>
        </ul>
      </Body>
    </Canvas>
  );
}
