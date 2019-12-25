import React from "react";
import classNames from "classnames";

import "./TextBox.css";

const TextBox = ({
  placeholder,
  disabled,
  type,
  className,
  value,
  onChange,
  ...props
}) => (
  <div className={`TextBox ${className}`} {...props}>
    <input
      className={classNames({
        empty: !value
      })}
      type={type}
      value={value}
      onChange={onChange}
      disabled={disabled}
    />
    <label>{placeholder}</label>
  </div>
);

export default TextBox;
