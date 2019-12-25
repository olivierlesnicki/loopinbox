import React from "react";
import { useHistory } from "react-router-dom";

import IconButton from "./IconButton";

export default function BackButton(props) {
  const history = useHistory();
  return (
    <IconButton
      icon="arrow-round-back"
      onClick={() => history.goBack()}
      {...props}
    />
  );
}
