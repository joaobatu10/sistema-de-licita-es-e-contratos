import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Chip,
  CircularProgress,
  Alert,
  Grid,
  Paper,
  Divider,
} from "@mui/material";
import {
  Person,
  Email,
  AdminPanelSettings,
  People,
} from "@mui/icons-material";

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://127.0.0.1:8000/usuarios/");
      if (!response.ok) {
        throw new Error("Erro ao buscar usuários");
      }
      const data = await response.json();
      setUsuarios(data);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      setError("Erro ao carregar lista de usuários");
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (username) => {
    return username.substring(0, 2).toUpperCase();
  };

  const getAvatarColor = (index) => {
    const colors = ['primary', 'secondary', 'success', 'warning', 'info', 'error'];
    return colors[index % colors.length];
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <People sx={{ fontSize: 32, color: 'primary.main' }} />
        <Typography variant="h4" component="h1">
          Usuários do Sistema
        </Typography>
      </Box>

      {/* Stats */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h3" color="primary.main" fontWeight="bold">
              {usuarios.length}
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Total de Usuários
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h3" color="success.main" fontWeight="bold">
              {usuarios.filter(u => u.username === 'admin').length}
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Administradores
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h3" color="info.main" fontWeight="bold">
              {usuarios.filter(u => u.username !== 'admin').length}
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Usuários Regulares
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Lista de Usuários */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Person />
            Lista de Usuários Cadastrados
          </Typography>
          <Divider sx={{ mb: 2 }} />

          {usuarios.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <People sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
              <Typography variant="h6" color="textSecondary">
                Nenhum usuário encontrado
              </Typography>
            </Box>
          ) : (
            <List>
              {usuarios.map((usuario, index) => (
                <React.Fragment key={usuario.id}>
                  <ListItem
                    sx={{
                      borderRadius: 2,
                      mb: 1,
                      bgcolor: 'background.default',
                      '&:hover': {
                        bgcolor: 'action.hover',
                      },
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar
                        sx={{
                          bgcolor: `${getAvatarColor(index)}.main`,
                          width: 56,
                          height: 56,
                          fontSize: '1.2rem',
                          fontWeight: 'bold',
                        }}
                      >
                        {getInitials(usuario.username)}
                      </Avatar>
                    </ListItemAvatar>
                    
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="h6" component="span">
                            {usuario.username}
                          </Typography>
                          {usuario.username === 'admin' && (
                            <Chip
                              icon={<AdminPanelSettings />}
                              label="Admin"
                              color="error"
                              size="small"
                            />
                          )}
                        </Box>
                      }
                      secondary={
                        <Box sx={{ mt: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                            <Email fontSize="small" color="action" />
                            <Typography variant="body2" color="textSecondary">
                              {usuario.email}
                            </Typography>
                          </Box>
                          <Typography variant="caption" color="textSecondary">
                            ID: {usuario.id}
                          </Typography>
                        </Box>
                      }
                    />
                    
                    <Box sx={{ textAlign: 'right' }}>
                      <Chip
                        label="Ativo"
                        color="success"
                        size="small"
                        variant="outlined"
                      />
                    </Box>
                  </ListItem>
                  
                  {index < usuarios.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default Usuarios;