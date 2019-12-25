import React from "react";

import "./IconButton.css";

export default function IconButton({ icon, ...props }) {
  return (
    <button className="IconButton" {...props}>
      <ion-icon name={icon}></ion-icon>
    </button>
  );
}
