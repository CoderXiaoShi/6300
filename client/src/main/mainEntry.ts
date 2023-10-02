import { app, BrowserWindow } from 'electron'

let mainWindow: BrowserWindow;

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 620,
    height: 620,
    center: true,
    webPreferences: {
      webSecurity: false,
    },
  });
  mainWindow.webContents.openDevTools()
  mainWindow.loadURL('http://localhost:5173/')
});
