import React, { useState } from "react";

import firebase from "./firebase";
import stripe from "./stripe";

import Button from "./Button";
import "./Payment.css";
import cloud from "./cloud";

export default () => {
  const [loading, setLoading] = useState();

  const cancel = async () => {
    await firebase.auth().signOut();
  };

  const submit = async () => {
    setLoading(true);

    try {
      // Get firebase token
      const token = await firebase.auth().currentUser.getIdToken();

      // Request a payment session
      const data = await cloud(
        "createPaymentSession",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // Redirect to Stripe Checkout
      await stripe.redirectToCheckout({
        sessionId: data.sessionId
      });
    } catch (e) {
      setLoading(false);
    }
  };

  return (
    <div className="Modal">
      <div className="Modal-Header">
        <div className="Modal-Title">Start membership</div>
        <div className="Modal-Subtitle">
          You need to subscribe to a membership to use Loopinbox. It's only 5€
          per month.
        </div>
      </div>
      <div className="Modal-Helper">
        The membership lets you send and received an unlimited number of loops.
        You can cancel at anytime.
      </div>
      <div className="Modal-ActionBar">
        <Button type="button" onClick={submit} disabled={loading}>
          Subscribe
        </Button>
        <Button type="button" onClick={cancel} inverted disabled={loading}>
          Cancel
        </Button>
      </div>
    </div>
  );
};
