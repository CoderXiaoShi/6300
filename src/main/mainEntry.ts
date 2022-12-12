import { app, BrowserWindow } from 'electron'
import process from 'process'

let mainWindow: BrowserWindow;

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    transparent: false,
    // width: 220,
    // height: 520,
    width: 620,
    height: 620,
    resizable: false,
    // frame: false,
  });
  // mainWindow.loadURL(process.argv[2]);
  mainWindow.loadURL('http://localhost:5173/')
  // mainWindow.webContents.openDevTools()
});
