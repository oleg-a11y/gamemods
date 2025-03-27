import * as alt from 'alt-client';
import * as native from 'natives';

let isAdmin = false;
let isPanelOpen = false;
let webview = null;

function createWebView() {
    webview = new alt.WebView('http://resource/client/html/index.html');
    
    webview.on('admin:closePanel', () => {
        closePanel();
    });

    webview.on('admin:teleport', (x, y, z) => {
        alt.emitServer('admin:teleportPlayer', x, y, z);
    });

    webview.on('admin:spawnVehicle', (model) => {
        alt.emitServer('admin:spawnVehicle', model);
    });
}

function closePanel() {
    if (!isPanelOpen || !webview) return;
    
    isPanelOpen = false;
    webview.visible = false;
    webview.unfocus();
    alt.showCursor(false);
    native.displayRadar(true);
    native.displayHud(true);
    alt.toggleGameControls(true);
}

alt.on('connectionComplete', () => {
    createWebView();
});

alt.on('keyup', (key) => {
    if (key === 0x59) {
        if (!isPanelOpen) {
            if (!webview) {
                createWebView();
            }
            alt.emitServer('admin:requestPermission');
        } else {
            closePanel();
            if (webview) {
                webview.emit('admin:hidePanel');
            }
        }
    }
});

alt.onServer('admin:permissionResponse', (hasPermission) => {
    if (hasPermission) {
        isPanelOpen = true;
        webview.visible = true;
        webview.focus();
        alt.showCursor(true);
        native.displayRadar(false);
        native.displayHud(false);
        alt.toggleGameControls(false);
        webview.emit('admin:showPanel');
    }
});

alt.onServer('admin:checkPermission', (hasPermission) => {
    isAdmin = hasPermission;
});

alt.onServer('admin:openPanel', () => {
    if (!isAdmin) return;
    
    isPanelOpen = true;
    webview.visible = true;
    webview.focus();
    alt.showCursor(true);
    native.displayRadar(false);
    native.displayHud(false);
    alt.toggleGameControls(false);
    webview.emit('admin:showPanel');
});

alt.onServer('admin:closePanel', () => {
    if (!isAdmin) return;
    closePanel();
    webview.emit('admin:hidePanel');
});

alt.on('admin:teleport', (x, y, z) => {
    if (!isAdmin) return;
    alt.emitServer('admin:teleportPlayer', x, y, z);
    closePanel();
    webview.emit('admin:hidePanel');
});

alt.onServer('admin:notification', (message, type = 'success') => {
    if (type === 'success') {
        webview.emit('admin:notification', message, type);
    }
}); 