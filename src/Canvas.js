import React from "react";
import classNames from "classnames";

import "./Canvas.css";

export default function Canvas({ borderless, className, ...props }) {
  return (
    <div
      className={classNames(
        {
          Canvas: true,
          Canvas_borderless: !!borderless
        },
        className
      )}
      {...props}
    />
  );
}

export function Header(props) {
  return <div className="CanvasHeader" {...props} />;
}

export function Body(props) {
  return <div className="CanvasBody" {...props} />;
}

export function Footer(props) {
  return <div className="CanvasFooter" {...props} />;
}

export function Modal(props) {
  return <div className="CanvasModal" {...props} />;
}
