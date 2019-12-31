const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const url = require("url");
const fs = require("fs-extra");
const download = require("download");

require("update-electron-app")({
  repo: "olivierlesnicki/loopinbox",
  updateInterval: "5 minutes"
});

const stripeCheckout = require("./stripe-checkout");

let mainWindow;

function createWindow() {
  const startUrl = process.env.ELECTRON_START_URL || "https://loopinbox.com";

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

ipcMain.on("ondragstart", (e, url) => {
  e.sender.startDrag({
    file
  });
});

const data = {
  loopCache: {}
};

const loopCacheDirectoryPath = path.join(
  app.getPath("home"),
  "Loopinbox",
  "loops"
);

const refreshLoopCache = async () => {
  await fs.ensureDir(loopCacheDirectoryPath);
  const files = await fs.readdir(loopCacheDirectoryPath);
  data.loopCache = files.reduce((loopCache, file) => {
    loopCache[file.split("/")[0]] = file;
    return loopCache;
  }, {});
};

ipcMain.on("loopinbox.ready", async e => {
  await refreshLoopCache();
  e.sender.send("loopinbox.data", data);
});

ipcMain.on("loopinbox.cache", async (e, { url, id }) => {
  const dir = path.join(loopCacheDirectoryPath, id);

  await download(url, dir);
  await refreshLoopCache();

  e.sender.send("loopinbox.data", data);
});

ipcMain.on("loopinbox.ondragstart", async (e, loop) => {
  const file = path.join(
    loopCacheDirectoryPath,
    data.loopCache[loop.id],
    loop.file.name
  );
  e.sender.startDrag({
    file,
    icon: path.join(__dirname, "file.png")
  });
});

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
