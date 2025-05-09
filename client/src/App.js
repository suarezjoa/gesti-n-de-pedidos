import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Paper, Grid, Button } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';
import PedidoForm from './components/PedidoForm';
import ListaPedidos from './components/ListaPedidos';

const API_URL = '/api';

function App() {
  const [pedidos, setPedidos] = useState([]);

  const cargarPedidos = async () => {
    try {
      const response = await axios.get(`${API_URL}/pedidos`);
      setPedidos(response.data);
    } catch (error) {
      console.error('Error al cargar pedidos:', error);
    }
  };

  useEffect(() => {
    cargarPedidos();
  }, []);

  const crearPedido = async (nuevoPedido) => {
    try {
      await axios.post(`${API_URL}/pedidos`, nuevoPedido);
      cargarPedidos();
    } catch (error) {
      console.error('Error al crear pedido:', error);
    }
  };

  const actualizarEstado = async (id, estado) => {
    try {
      await axios.put(`${API_URL}/pedidos/${id}/estado`, { estado });
      cargarPedidos();
    } catch (error) {
      console.error('Error al actualizar estado:', error);
    }
  };

  const eliminarPedido = async (id) => {
    try {
      await axios.delete(`${API_URL}/pedidos/${id}`);
      cargarPedidos();
    } catch (error) {
      console.error('Error al eliminar pedido:', error);
    }
  };

  return (
    <Router>
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom align="center">
            Sistema de Gestión de Pedidos
          </Typography>
          <Routes>
            <Route path="/" element={
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Paper sx={{ p: 2 }}>
                    <PedidoForm onSubmit={crearPedido} />
                  </Paper>
                </Grid>
                <Grid item xs={12} md={8}>
                  <Paper sx={{ p: 2 }}>
                    <Box sx={{ mb: 2, textAlign: 'right' }}>
                      <Button
                        component={Link}
                        to="/pedidos"
                        variant="contained"
                        color="primary"
                      >
                        Ver Pedidos Activos
                      </Button>
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
            } />
            <Route path="/pedidos" element={
              <Box>
                <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Button
                    component={Link}
                    to="/"
                    variant="outlined"
                    color="primary"
                  >
                    Volver
                  </Button>
                  <Typography variant="h5">
                    Pedidos Activos
                  </Typography>
                </Box>
                <Paper sx={{ p: 2 }}>
                  <ListaPedidos 
                    pedidos={pedidos} 
                    onEstadoChange={actualizarEstado}
                    onEliminar={eliminarPedido}
                  />
                </Paper>
              </Box>
            } />
          </Routes>
        </Box>
      </Container>
    </Router>
  );
}

export default App;
