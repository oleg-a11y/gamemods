import * as alt from 'alt-server';

const ADMIN_SOCIAL_IDS = [
    498714787 // Treve
];

function isAdmin(player) {
    const playerSocialID = parseInt(player.socialID);
    return ADMIN_SOCIAL_IDS.includes(playerSocialID);
}

alt.onClient('admin:requestPermission', (player) => {
    const hasPermission = isAdmin(player);
    
    if (hasPermission) {
        alt.emitClient(player, 'admin:permissionResponse', true);
        alt.emitClient(player, 'admin:openPanel');
    } else {
        alt.emitClient(player, 'admin:permissionResponse', false);
    }
});

alt.onClient('admin:teleportPlayer', (player, x, y, z) => {
    if (!isAdmin(player)) return;
    player.pos = new alt.Vector3(x, y, z);
});

alt.onClient('admin:spawnVehicle', (player, model) => {
    if (!isAdmin(player)) return;
    
    try {
        const playerPos = player.pos;
        const spawnPos = new alt.Vector3(
            playerPos.x + 5,
            playerPos.y + 5,
            playerPos.z
        );
        
        const vehicle = new alt.Vehicle(model, spawnPos.x, spawnPos.y, spawnPos.z, 0, 0, 0);
        vehicle.owner = player;
        alt.emitClient(player, 'admin:notification', `Машина ${model} создана!`);
        
    } catch (error) {
        alt.emitClient(player, 'admin:notification', 'Ошибка при создании машины!');
    }
});