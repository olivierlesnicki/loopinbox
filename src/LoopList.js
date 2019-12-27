import React from "react";

import Loop from "./Loop";
import { usePlayer } from "./player";
import { useElectron } from "./electron";
import firebase from "./firebase";

import "./LoopList.css";

const storage = firebase.storage();

export default function LoopList({ loops, newLoops, refresh }) {
  const { currentLoop, toggle } = usePlayer();
  const { data, send } = useElectron();

  const download = async loop => {
    const url = await storage.ref(loop.file.path).getDownloadURL();
    send("cache", {
      id: loop.id,
      url
    });
  };

  return (
    <div className="LoopList">
      {!!newLoops.length && (
        <div className="LoopList-new" onClick={refresh}>
          You received {newLoops.length} new loops. Click here to refresh.
        </div>
      )}
      {loops.map(loop => (
        <Loop
          key={loop.id}
          loop={loop}
          toggle={() => toggle(loop)}
          download={async () => download(loop)}
          isActive={currentLoop && currentLoop.file.path === loop.file.path}
          isCached={!!data.loopCache[loop.id]}
          onDragStart={e => {
            e.preventDefault();
            send("ondragstart", loop);
          }}
        />
      ))}
    </div>
  );
}
