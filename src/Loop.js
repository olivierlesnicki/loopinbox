import React from "react";
import classnames from "classnames";
import pretty from "pretty-bytes";

import "./Loop.css";

export default function Loop({
  loop,
  isActive,
  isCached,
  onDragStart,
  toggle,
  download
}) {
  return (
    <div
      className={classnames("Loop", {
        Loop_active: isActive,
        Loop_cached: isCached
      })}
      onClick={toggle}
      onDragStart={onDragStart}
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
      {!isCached && (
        <button
          onClick={e => {
            e.stopPropagation();
            download && download();
          }}
          className="Loop-download"
        >
          <ion-icon name="cloud-download"></ion-icon>
        </button>
      )}
    </div>
  );
}
