const express = require('express');
const cors = require('cors');
const redis = require('./config/redis');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Conectar Redis
(async () => {
    await redis.connect();
})();

// Rutas para pedidos
app.post('/api/pedidos', async (req, res) => {
    try {
        const pedido = req.body;
        const pedidoId = Date.now().toString();
        await redis.getClient().hSet('pedidos', pedidoId, JSON.stringify({
            ...pedido,
            estado: 'pendiente',
            fecha: new Date().toISOString()
        }));
        res.json({ id: pedidoId, mensaje: 'Pedido creado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el pedido' });
    }
});

app.get('/api/pedidos', async (req, res) => {
    try {
        const pedidos = await redis.getClient().hGetAll('pedidos');
        const pedidosArray = Object.entries(pedidos).map(([id, pedido]) => ({
            id,
            ...JSON.parse(pedido)
        }));
        res.json(pedidosArray);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los pedidos' });
    }
});

app.put('/api/pedidos/:id/estado', async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;
        const pedido = await redis.getClient().hGet('pedidos', id);
        
        if (!pedido) {
            return res.status(404).json({ error: 'Pedido no encontrado' });
        }

        const pedidoActualizado = {
            ...JSON.parse(pedido),
            estado
        };

        await redis.getClient().hSet('pedidos', id, JSON.stringify(pedidoActualizado));
        res.json({ mensaje: 'Estado del pedido actualizado' });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el estado del pedido' });
    }
});

app.delete('/api/pedidos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const pedido = await redis.getClient().hGet('pedidos', id);
        
        if (!pedido) {
            return res.status(404).json({ error: 'Pedido no encontrado' });
        }

        await redis.getClient().hDel('pedidos', id);
        res.json({ mensaje: 'Pedido eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el pedido' });
    }
});

app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
}); 