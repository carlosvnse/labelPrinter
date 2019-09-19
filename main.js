const electron = require('electron')
    // Module to control application life.
const app = electron.app
const ipcMain = electron.ipcMain
    // Module to create native browser window.
const BrowserWindow = electron.BrowserWindow
const Menu = electron.Menu

const path = require('path')
const url = require('url')

const {join} = require('path');
const {execFile} = require('child_process');


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let workerWindow = null;

function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 600,
        icon: 'icon.ico',
        webPreferences: {
            nodeIntegration: true,
            preload: path.join(__dirname, 'preload.js')
        }
    })

    // and load the index.html of the app.
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }))

    // Open the DevTools.
    //mainWindow.webContents.openDevTools()

    // Emitted when the window is closed.
    mainWindow.on('closed', function() {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
    })

    
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });

    workerWindow = new BrowserWindow({
        width: 400,
        height: 300,
        icon: 'icon.ico',
        webPreferences: {
            nodeIntegration: true,
            preload: path.join(__dirname, 'preload.js')
        }
    });
    workerWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'worker.html'),
        protocol: 'file:',
        slashes: true
    }));

    // TODO: Checar aquí
    // workerWindow.webContents.openDevTools();
    workerWindow.hide();
    workerWindow.on("closed", () => {
        workerWindow = null;
    });
   
    
    
                
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function() {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    app.quit()
})

app.on('activate', function() {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow()
    }
})


// @XXX Fake print
function printSmall(event, plcCode) {
    const root = process.cwd();  // LabelPrinter folder root
    const execPath = path.resolve('zebra-printer.js');

    execFile('node', [execPath, plcCode], (error, stdout, stderr) => {
        if (error) {
            event.sender.send('printed-small', {error, stderr, execPath});
            return false;
        }
        // the *entire* stdout and stderr (buffered)
        event.sender.send('printed-small', {execPath, stdout, env: process.env.NODE_ENV});
    });
}

ipcMain.on('reply', (event, message) => {
    console.log(message);
    
	mainWindow.webContents.send('messageFromMain', `This is the message from the second window: ${message}`);
})

// Send message print
ipcMain.on('print', function(event, content) {
    //console.log("en ipc main print: " + content);
    //workerWindow.webContents.executeJavaScript("saludo()");
    workerWindow.webContents.send('print', content);

});

// @XXX Fake print
ipcMain.on('print-small', function(event, plcCode) {
    console.log("en ipc main print-small: " + plcCode);
    var properties = [];
    for(var i in workerWindow){
        try{
            properties.push(i);
        }catch(error){
    
        }
    }
    

    
    printSmall(event, plcCode);
});

// Send message readyToPrint
ipcMain.on("readyToPrint", function(event) {
    let options = {
        silent: true,
        printBackground: true
    };

    workerWindow.webContents.print(options, function(success) {
        console.log('Success', success);
    });
});

ipcMain.on("prueba", function(event, {plcCode}){
    console.log("en ipc main prueba: " + plcCode);
});
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.