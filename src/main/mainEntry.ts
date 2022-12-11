import { app, BrowserWindow } from 'electron'

let mainWindow: BrowserWindow;

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    // transparent: true,
    // width: 220,
    // height: 520,
    width: 320,
    height: 620,
    resizable: false,
    frame: false,
  });
  // mainWindow.loadURL(process.argv[2]);
  mainWindow.loadURL('http://localhost:5173/')
  mainWindow.webContents.openDevTools()
});
