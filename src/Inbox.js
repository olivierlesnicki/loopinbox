import React, { useState } from "react";
import { useHistory } from "react-router-dom";

import Button from "./Button";
import Canvas, { Header, Body } from "./Canvas";
import IconButton from "./IconButton";

import "./Inbox.css";
import LoopList from "./LoopList";
import { useUserData } from "./userData";

export default function InboxPage() {
  const [tab, setTab] = useState("inbox");
  const history = useHistory();
  const userData = useUserData();

  return (
    <div className="InboxPage">
      <Canvas>
        <Header>
          <IconButton
            icon="menu"
            onClick={() => {
              history.push("/menu");
            }}
          />
          <Button
            inverted
            icon="add"
            onClick={() => {
              history.push("/send");
            }}
          >
            Send
          </Button>
        </Header>
        <div className="Inbox-tabs">
          <div
            className={tab === "inbox" ? "active" : ""}
            onClick={() => setTab("inbox")}
          >
            Inbox
          </div>
          <div
            className={tab === "outbox" ? "active" : ""}
            onClick={() => setTab("outbox")}
          >
            Outbox
          </div>
        </div>
        <Body>
          <div
            className="Inbox-tab"
            style={{
              display: tab === "inbox" ? "block" : "none"
            }}
          >
            <LoopList
              loops={userData.inbox.loops}
              newLoops={userData.inbox.newLoops}
              refresh={userData.inbox.refresh}
            />
          </div>
          <div
            className="Inbox-tab"
            style={{
              display: tab === "outbox" ? "block" : "none"
            }}
          >
            <LoopList
              loops={userData.outbox.loops}
              newLoops={userData.outbox.newLoops}
              refresh={userData.outbox.refresh}
            />
          </div>
        </Body>
      </Canvas>
    </div>
  );
}
