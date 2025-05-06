import React from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  Chip,
  Box
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';

function ListaPedidos({ pedidos, onEstadoChange, onEliminar }) {
  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'pendiente':
        return 'warning';
      case 'listo':
        return 'success';
      case 'entregado':
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Pedidos Activos
      </Typography>
      <List>
        {pedidos.map((pedido) => (
          <ListItem
            key={pedido.id}
            divider
            sx={{
              bgcolor: pedido.estado === 'entregado' ? 'action.hover' : 'background.paper'
            }}
          >
            <ListItemText
              primary={`Mesa ${pedido.mesa}`}
              secondary={
                <>
                  <Typography component="span" variant="body2" color="text.primary">
                    Items: {pedido.items}
                  </Typography>
                  <br />
                  {pedido.observaciones && (
                    <Typography component="span" variant="body2" color="text.secondary">
                      Obs: {pedido.observaciones}
                    </Typography>
                  )}
                  <br />
                  <Typography component="span" variant="caption" color="text.secondary">
                    Fecha: {new Date(pedido.fecha).toLocaleString()}
                  </Typography>
                </>
              }
            />
            <ListItemSecondaryAction>
              <Chip
                label={pedido.estado.toUpperCase()}
                color={getEstadoColor(pedido.estado)}
                size="small"
                sx={{ mr: 1 }}
              />
              {pedido.estado === 'pendiente' && (
                <IconButton
                  edge="end"
                  color="success"
                  onClick={() => onEstadoChange(pedido.id, 'listo')}
                  sx={{ mr: 1 }}
                >
                  <CheckCircleIcon />
                </IconButton>
              )}
              {pedido.estado === 'listo' && (
                <IconButton
                  edge="end"
                  color="primary"
                  onClick={() => onEstadoChange(pedido.id, 'entregado')}
                  sx={{ mr: 1 }}
                >
                  <CheckCircleIcon />
                </IconButton>
              )}
              <IconButton
                edge="end"
                color="error"
                onClick={() => onEliminar(pedido.id)}
              >
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

export default ListaPedidos; 