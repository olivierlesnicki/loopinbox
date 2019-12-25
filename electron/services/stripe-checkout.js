const url = require("url");
const { BrowserWindow } = require("electron");

module.exports = mainWindow => {
  const onNavigate = (event, newUrl) => {
    const urlParts = url.parse(newUrl, true);

    if (urlParts.host === "checkout.stripe.com") {
      event.preventDefault();

      const checkoutWindow = new BrowserWindow({ parent: mainWindow });

      checkoutWindow.loadURL(newUrl);
      checkoutWindow.show();

      const onNavigate = (event, newUrl) => {
        const urlParts = url.parse(newUrl, true);

        if (urlParts.host === "loopinbox") {
          mainWindow.webContents.send("url", {
            path: urlParts.path
          });
        }

        setImmediate(() => {
          checkoutWindow.close();
        });
      };

      checkoutWindow.webContents.on("will-navigate", (event, newUrl) => {
        onNavigate(event, newUrl);
      });

      checkoutWindow.webContents.on(
        "did-get-redirect-request",
        (event, oldUrl, newUrl) => {
          onNavigate(event, newUrl);
        }
      );
    }
  };

  mainWindow.webContents.on("will-navigate", (event, newUrl) => {
    onNavigate(event, newUrl);
  });

  mainWindow.webContents.on(
    "did-get-redirect-request",
    (event, oldUrl, newUrl) => {
      onNavigate(event, newUrl);
    }
  );
};
