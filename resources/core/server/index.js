import * as alt from "alt-server";
import * as path from "path";

import { loadDataJson, saveDataJson } from "./utils/makeJson.js";

alt.on("playerConnect", onPlayerConnect);
alt.on("playerDisconnect", onPlayerDisconnect);
alt.on("anyResourceStop", onAnyResourceStop);

export const PLAYERS_DATA_FILE = path.join(
  alt.rootDir,
  "resources",
  "core",
  "server",
  "data",
  "players.json"
);

export const DEFAULT_SPAWN = { x: -1037.747, y: -2738.308, z: 20.0 };

function onPlayerConnect(player) {
  const playersData = loadDataJson(PLAYERS_DATA_FILE);

  let spawnPos = DEFAULT_SPAWN;

  if (
    playersData[player.socialID] &&
    playersData[player.socialID].lastPosition
  ) {
    spawnPos = playersData[player.socialID].lastPosition;
  }

  player.spawn(spawnPos.x, spawnPos.y, spawnPos.z, 0);
  player.model = "mp_m_freemode_01";
}

function savePlayerPosition(player) {
  if (!player || !player.valid) {
    return;
  }

  const playersData = loadDataJson(PLAYERS_DATA_FILE);

  playersData[player.socialID] = {
    lastPosition: {
      x: player.pos.x,
      y: player.pos.y,
      z: player.pos.z,
    },
    name: player.name,
  };

  saveDataJson(PLAYERS_DATA_FILE, playersData);
}

function onPlayerDisconnect(player) {
  savePlayerPosition(player);
}

function onAnyResourceStop() {
  alt.Player.all.forEach((player) => {
    if (player && player.valid) {
      savePlayerPosition(player);
    }
  });
}
