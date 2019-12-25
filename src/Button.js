import React from "react";
import classNames from "classnames";

import "./Button.css";

export default function Button({ children, disabled, inverted, ...props }) {
  return (
    <button
      className={classNames("Button", {
        Button_disabled: disabled,
        Button_inverted: inverted
      })}
      {...props}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
