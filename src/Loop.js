import React from "react";
import classnames from "classnames";
import pretty from "pretty-bytes";

import firebase from "./firebase";

import "./Loop.css";

const { ipcRenderer } = window;
const storage = firebase.storage();

export default function Loop({ loop, isActive, isCached, toggle }) {
  const download = async e => {
    e.stopPropagation();

    const url = await storage.ref(loop.file.path).getDownloadURL();
  };

  return (
    <div
      className={classnames("Loop", {
        Loop_active: isActive,
        Loop_cached: isCached
      })}
      onClick={toggle}
      draggable={isCached}
    >
      <div className="Loop-content">
        <div className="Loop-icon">
          {isActive ? (
            <ion-icon name="volume-high" />
          ) : (
            <ion-icon name="musical-note" />
          )}
        </div>
        <div className="Loop-icon-hover">
          {isActive ? <ion-icon name="square" /> : <ion-icon name="play" />}
        </div>
        <div className="Loop-details">
          <div className="Loop-name">{loop.file.name}</div>
          <div className="Loop-metadata">
            @{loop.user.username} - {pretty(Number(loop.file.size))}
          </div>
        </div>
      </div>
      <button onClick={download} className="Loop-download">
        <ion-icon name="cloud-download"></ion-icon>
      </button>
    </div>
  );
}
