import { app, BrowserWindow } from 'electron'

let mainWindow: BrowserWindow;

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    transparent: false,
    width: 620,
    height: 620,
    resizable: false,

    // frame: false,
    skipTaskbar: false,
    // minWidth: 650,
    center: true,
    webPreferences: {
      webSecurity: false,
      webviewTag: true,
      spellcheck: false,
      nodeIntegration: true,
      allowRunningInsecureContent: true,
      backgroundThrottling: true, // 提高最小化页面的性能
      contextIsolation: false,
    },
  });
  mainWindow.loadURL('http://localhost:5173/')
  mainWindow.webContents.openDevTools()
});
