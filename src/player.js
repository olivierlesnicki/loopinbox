import React, { useCallback, useContext, useState, useEffect } from "react";
import firebase from "firebase";

import { Howl } from "howler";

const noop = () => {};

const playerContext = React.createContext({
  toggle: noop
});

class LLP {
  constructor() {
    this.currentHowl = null;
    this.urls = {};
    this.howls = {};
  }

  async toggle(loop) {
    let url = this.urls[loop.id];

    if (!url) {
      url = this.urls[loop.id] = await firebase
        .storage()
        .ref(loop.file.path)
        .getDownloadURL();
    }

    let howl = this.howls[url];

    if (!howl) {
      howl = this.howls[url] = new Howl({
        src: url,
        html5: true
      });
    }

    if (this.currentHowl === howl) {
      this.currentHowl.playing()
        ? this.currentHowl.stop()
        : this.currentHowl.play();
    } else {
      this.currentHowl && this.currentHowl.stop();
      this.currentHowl = howl;
      this.currentHowl.play();
    }
  }

  unload() {
    Object.keys(this.howls).forEach(key => this.howls[key].unload());
  }
}

export function PlayerProvider(props) {
  const [llp, setLlp] = useState(null);
  const [currentLoop, setCurrentLoop] = useState(null);

  useEffect(() => {
    const llp = new LLP();
    setLlp(llp);

    return () => {
      llp && llp.unload();
    };
  }, []);

  const toggle = useCallback(
    loop => {
      setCurrentLoop(loop);
      llp.toggle(loop);
    },
    [llp]
  );

  return (
    <playerContext.Provider
      value={{
        toggle,
        currentLoop
      }}
      {...props}
    />
  );
}

export function usePlayer() {
  return useContext(playerContext);
}
