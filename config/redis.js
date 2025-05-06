const Redis = require('redis');

const redisLocalClient = Redis.createClient({
    url: process.env.REDIS_LOCAL_URL || 'redis://redis-local:6379'
});

const redisCloudClient = Redis.createClient({
    url: process.env.REDIS_CLOUD_URL || 'redis://default:BoUjk8scKVpa2G1nOmjuubsI72ChmfDk@redis-14058.c336.samerica-east1-1.gce.redns.redis-cloud.com:14058'
});

let activeClient = redisLocalClient;

// Función para cambiar al cliente de respaldo
const switchToBackup = async () => {
    console.log('Cambiando a Redis Cloud...');
    activeClient = redisCloudClient;
    try {
        await activeClient.connect();
        console.log('Conectado a Redis Cloud exitosamente');
    } catch (error) {
        console.error('Error al conectar a Redis Cloud:', error);
    }
};

// Configurar eventos para el cliente local
redisLocalClient.on('error', async (err) => {
    console.log('Error en Redis Local:', err);
    if (activeClient === redisLocalClient) {
        await switchToBackup();
    }
});

redisLocalClient.on('connect', () => {
    console.log('Redis Local conectado');
    activeClient = redisLocalClient;
});

// Configurar eventos para el cliente cloud
redisCloudClient.on('error', (err) => {
    console.log('Error en Redis Cloud:', err);
});

redisCloudClient.on('connect', () => {
    console.log('Redis Cloud conectado');
});

// Función para conectar ambos clientes
const connectClients = async () => {
    try {
        await redisLocalClient.connect();
        console.log('Conectado a Redis Local exitosamente');
    } catch (error) {
        console.error('Error al conectar a Redis Local:', error);
        await switchToBackup();
    }
};

// Exportar el cliente activo y la función de conexión
module.exports = {
    getClient: () => activeClient,
    connect: connectClients
}; 