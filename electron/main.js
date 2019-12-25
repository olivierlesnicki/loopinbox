const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const url = require("url");
const fs = require("fs-extra");
const download = require("download");

const stripeCheckout = require("./services/stripe-checkout");

let mainWindow;

function createWindow() {
  const startUrl =
    process.env.ELECTRON_START_URL ||
    url.format({
      pathname: path.join(__dirname, "../index.html"),
      protocol: "file:",
      slashes: true
    });

  mainWindow = new BrowserWindow({
    width: 360,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js")
    }
  });

  mainWindow.loadURL(startUrl);

  mainWindow.on("closed", function() {
    mainWindow = null;
  });

  stripeCheckout(mainWindow);
}

app.on("ready", createWindow);

app.on("window-all-closed", function() {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", function() {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on("ondragstart", (e, url) => {
  e.sender.startDrag({
    file
  });
});

ipcMain.on("loopinbox.requestLoopCache", async e => {
  const loopCacheDirectoryPath = path.join(
    app.getPath("home"),
    "Loopinbox",
    "loops"
  );

  await fs.ensureDir(loopCacheDirectoryPath);

  const loopCache = await fs.readdir(loopCacheDirectoryPath);
  e.sender.send("loopinbox.loopCache", loopCache || []);
});

ipcMain.on("loopinbox.cache", async (e, url) => {
  const loopCacheDirectoryPath = path.join(
    app.getPath("home"),
    "Loopinbox",
    "loops"
  );

  await fs.ensureDir(loopCacheDirectoryPath);
  await download(url, loopCacheDirectoryPath);

  const loopCache = await fs.readdir(loopCacheDirectoryPath);
  e.sender.send("loopinbox.loopCache", loopCache || []);
});
