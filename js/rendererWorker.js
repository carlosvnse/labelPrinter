const ipc = require("electron").ipcRenderer;
        


window.addEventListener('load', () => {
    try {
        ipc.on('message', (event, message) => console.log(message));

        ipc.on("print", function (event, content) {
            var div = document.getElementById("etiquetas");
            div.innerHTML = content;
            ipc.send("readyToPrint");
        });
        const sendMessageButton = document.getElementById('send-message');

        sendMessageButton.addEventListener('click', event => {
            ipc.send('reply', 'Sending message from second window to renderer via main.');
            //window.close();
        });
    } catch (e) { console.log(e); }
}, false);