import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';

function PedidoForm({ onSubmit }) {
  const [pedido, setPedido] = useState({
    mesa: '',
    items: '',
    observaciones: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPedido(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(pedido);
    setPedido({
      mesa: '',
      items: '',
      observaciones: ''
    });
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography variant="h6" gutterBottom>
        Nuevo Pedido
      </Typography>
      <TextField
        fullWidth
        label="Número de Mesa"
        name="mesa"
        value={pedido.mesa}
        onChange={handleChange}
        margin="normal"
        required
      />
      <TextField
        fullWidth
        label="Items del Pedido"
        name="items"
        value={pedido.items}
        onChange={handleChange}
        margin="normal"
        required
        multiline
        rows={4}
      />
      <TextField
        fullWidth
        label="Observaciones"
        name="observaciones"
        value={pedido.observaciones}
        onChange={handleChange}
        margin="normal"
        multiline
        rows={2}
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 2 }}
      >
        Crear Pedido
      </Button>
    </Box>
  );
}

export default PedidoForm; 