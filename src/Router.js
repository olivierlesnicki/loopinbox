import React, { useCallback, useEffect } from "react";
import { Switch, Route, Redirect, useHistory } from "react-router-dom";

import Inbox from "./Inbox";
import Login from "./Login";
import Payment from "./Payment";
import PaymentSuccess from "./PaymentSuccess";
import Send from "./Send";
import Verify from "./Verify";
import Menu from "./Menu";

import { PlayerProvider } from "./player";
import { useAuth } from "./auth";
import { UserDataProvider } from "./userData";

const { ipcRenderer } = window;

export default function() {
  const auth = useAuth();
  const history = useHistory();

  const handleUrl = useCallback(
    (e, { path, state }) => {
      history.push(path, state);
    },
    [history]
  );

  useEffect(() => {
    ipcRenderer.on("url", handleUrl);
    return () => ipcRenderer.removeAllListeners("url");
  }, []);

  if (auth.loading) return null;

  if (!auth.user)
    return (
      <Switch>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/verify">
          <Verify />
        </Route>
        <Route path="*">
          <Redirect to={{ pathname: "/login" }} />
        </Route>
        <Route></Route>
      </Switch>
    );

  if (
    !auth.account.subscription ||
    auth.account.subscription.status !== "active"
  )
    return (
      <Switch>
        <Route path="/payment" exact>
          <Payment />
        </Route>
        <Route path="/payment/success">
          <PaymentSuccess />
        </Route>
        <Route path="*">
          <Redirect to={{ pathname: "/payment" }} />
        </Route>
      </Switch>
    );

  return (
    <UserDataProvider>
      <PlayerProvider>
        <Switch>
          <Route path="/inbox">
            <Inbox />
          </Route>
          <Route path="/send">
            <Send />
          </Route>
          <Route path="/menu">
            <Menu />
          </Route>
          <Route path="*">
            <Redirect to={{ pathname: "/inbox" }} />
          </Route>
        </Switch>
      </PlayerProvider>
    </UserDataProvider>
  );
}
