import { app, BrowserWindow } from 'electron'

let mainWindow: BrowserWindow;

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    transparent: false,
    width: 620,
    height: 620,
    // frame: false,
    skipTaskbar: false,
    minWidth: 650,
    center: true,
    minHeight: 500,
    // minWidth: 650,
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
  mainWindow.webContents.openDevTools()
  mainWindow.loadURL('http://localhost:5173/')
});
