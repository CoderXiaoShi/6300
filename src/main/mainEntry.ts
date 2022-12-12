import { app, BrowserWindow } from 'electron'

let mainWindow: BrowserWindow;

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    transparent: false,
    width: 620,
    height: 620,
    resizable: false,
    // frame: false,
  });
  mainWindow.loadURL('http://localhost:5173/')
  // mainWindow.webContents.openDevTools()
});
