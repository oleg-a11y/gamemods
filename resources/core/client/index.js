import * as alt from "alt-client";

alt.on("playerConnect", onPlayerConnect);
alt.on("playerDisconnect", onPlayerDisconnect);

function onPlayerConnect() {
  alt.log(`Player ${alt.Player.local.name} connected`);
}

function onPlayerDisconnect() {
  alt.log(`Player ${alt.Player.local.name} disconnected`);
}
