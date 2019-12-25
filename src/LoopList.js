import React from "react";

import Loop from "./Loop";
import { usePlayer } from "./player";

import "./LoopList.css";

export default function LoopList({ loops, newLoops, refresh }) {
  const { currentLoop, toggle } = usePlayer();

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
          isActive={currentLoop && currentLoop.file.path === loop.file.path}
        />
      ))}
    </div>
  );
}
