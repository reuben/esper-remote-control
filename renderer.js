// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const Browser = require('remote-browser').Browser;
const os = require('os');

function getLocalIp() {
    var ifaces = os.networkInterfaces();
    var keys = Object.keys(ifaces);
    for (let i = 0; i < keys.length; ++i) {
        let iface = ifaces[keys[i]];
        console.log(iface);
        for (let j = 0; j < iface.length; ++j) {
            if (iface[i] && (iface[i].family !== 'IPv4' || iface[i].internal === true)) {
                continue;
            }
            return iface[i].address;
        }
    }
}


document.addEventListener('DOMContentLoaded', () => {
    const b = new Browser();
    b.listen(8000).then((url) => {
        document.getElementById('status').textContent = 'URL para conexão: ws://' + getLocalIp() + ':8000';
    });

    document.getElementById('undo').addEventListener('click', () => {
        b(() => UndoLast());
    });

    document.getElementById('error').addEventListener('click', () => {
        b(() => ErrorNotification());
    });

    document.getElementById('find').addEventListener('click', () => {
        b((text) => RunCmd('find', text), document.getElementById('find-text').value);
    });

    function listener(e) {
        let id = e.target.id;
        b((id) => RunCmd(id), id);
    }

    let buttons = document.querySelectorAll('button.cmd');
    for (let i = 0; i < buttons.length; ++i) {
        let btn = buttons[i];
        btn.addEventListener('click', listener);
    }
});

