// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const ipc = require('electron').ipcRenderer;

const serialport = require('serialport')
const createTable = require('data-table')

serialport.list((err, ports) => {
  console.log('ports', ports);
  if (err) {
    //document.getElementById('error').textContent = err.message
    return
  } else {
    //document.getElementById('error').textContent = ''
  }

  if (ports.length === 0) {
    //document.getElementById('error').textContent = 'No ports discovered'
  }

  //const headers = Object.keys(ports[0])
  //const table = createTable(headers)
  //tableHTML = ''
  //table.on('data', data => tableHTML += data)
  //table.on('end', () => document.getElementById('ports').innerHTML = tableHTML)
  //ports.forEach(port => table.write(port))
  //table.end();
  
})


const port = new serialport('COM5', { autoOpen: false })

port.open(function (err) {
  if (err) {
    return console.log('Error opening port: ', err.message)
  }
  // Because there's no callback to write, write errors will be emitted on the port:
  document.getElementById('statusPLC').innerHTML = "Comunicación abierta con l PLC";
  document.getElementById('statusPLC').style.backgroundColor = "#0000ff";
  port.write('main screen turn on')
})

// The open event is always emitted
port.on('open', function() {
  // open logic

  document.getElementById('statusPLC').innerHTML = "En espera de orden de PLC";
  document.getElementById('statusPLC').style.backgroundColor = "#00ff00";
  console.log("puerto abierto");
})
// Read data that is available but keep the stream in "paused mode"
port.on('readable', function () {
  console.log('Data1:', port.read())
  //document.getElementById('statusPLC').innerHTML = "Imprimiendo etiqueta";
  //document.getElementById('statusPLC').style.backgroundColor = "#ff0000";
  
  
})

// Switches the port into "flowing mode"
port.on('data', function (data) {
  console.log('Data2:', data)
  //document.getElementById('statusPLC').innerHTML = "Imprimiendo etiqueta 1";
  //document.getElementById('statusPLC').style.backgroundColor = "#ff0000";
  handlePLCDataArrived(data)
})

ipc.on('messageFromMain', (event, message) => {
	console.log(`This is the message from the second window sent via main: ${message}`);
});
