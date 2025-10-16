import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  IconButton,
  Button,
  List,
  ListItem,
  Divider,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  Badge,
} from "@mui/material";
import {
  Notifications,
  NotificationsActive,
  Check,
  Delete,
  MarkEmailRead,
  Refresh,
} from "@mui/icons-material";

const Notificacoes = () => {
  const [notificacoes, setNotificacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNotif, setSelectedNotif] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const fetchNotificacoes = async () => {
    try {
      setLoading(true);
      // Buscar notificações do usuário logado (se houver) + globais
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const url = user.id 
        ? `http://127.0.0.1:8000/notificacoes/?usuario_id=${user.id}`
        : "http://127.0.0.1:8000/notificacoes/";
        
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Erro ao buscar notificações");
      }
      const data = await response.json();
      setNotificacoes(data);
    } catch (error) {
      console.error("Erro ao buscar notificações:", error);
    } finally {
      setLoading(false);
    }
  };

  const marcarComoLida = async (id) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/notificacoes/${id}/marcar-lida`, {
        method: 'PATCH',
      });
      
      if (response.ok) {
        // Atualizar o estado local
        setNotificacoes(prev => 
          prev.map(notif => 
            notif.id === id ? { ...notif, lida: true, data_leitura: new Date().toISOString() } : notif
          )
        );
      }
    } catch (error) {
      console.error("Erro ao marcar como lida:", error);
    }
  };

  const marcarTodasComoLidas = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const url = user.id 
        ? `http://127.0.0.1:8000/notificacoes/marcar-todas-lidas?usuario_id=${user.id}`
        : "http://127.0.0.1:8000/notificacoes/marcar-todas-lidas";
        
      const response = await fetch(url, { method: 'PATCH' });
      
      if (response.ok) {
        // Atualizar todas como lidas
        setNotificacoes(prev => 
          prev.map(notif => ({ ...notif, lida: true, data_leitura: new Date().toISOString() }))
        );
      }
    } catch (error) {
      console.error("Erro ao marcar todas como lidas:", error);
    }
  };

  const deletarNotificacao = async (id) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/notificacoes/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setNotificacoes(prev => prev.filter(notif => notif.id !== id));
        setOpenDialog(false);
      }
    } catch (error) {
      console.error("Erro ao deletar notificação:", error);
    }
  };

  const getCorTipo = (tipo) => {
    const cores = {
      info: "primary",
      success: "success",
      warning: "warning",
      error: "error"
    };
    return cores[tipo] || "default";
  };

  const getIconeTipo = (tipo) => {
    const icones = {
      info: "📋",
      success: "✅",
      warning: "⚠️",
      error: "❌"
    };
    return icones[tipo] || "📢";
  };

  const naoLidas = notificacoes.filter(n => !n.lida).length;

  useEffect(() => {
    fetchNotificacoes();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Badge badgeContent={naoLidas} color="error">
            <Notifications sx={{ fontSize: 32, color: 'primary.main' }} />
          </Badge>
          <Typography variant="h4" component="h1">
            Notificações
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Atualizar">
            <IconButton onClick={fetchNotificacoes} color="primary">
              <Refresh />
            </IconButton>
          </Tooltip>
          {naoLidas > 0 && (
            <Button
              variant="outlined"
              startIcon={<MarkEmailRead />}
              onClick={marcarTodasComoLidas}
              size="small"
            >
              Marcar Todas como Lidas
            </Button>
          )}
        </Box>
      </Box>

      {/* Stats */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Alert severity="info" sx={{ flex: 1 }}>
          <strong>{notificacoes.length}</strong> notificações totais
        </Alert>
        {naoLidas > 0 && (
          <Alert severity="warning" sx={{ flex: 1 }}>
            <strong>{naoLidas}</strong> não lidas
          </Alert>
        )}
      </Box>

      {/* Lista de Notificações */}
      {notificacoes.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <Notifications sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
            <Typography variant="h6" color="textSecondary">
              Nenhuma notificação encontrada
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <List>
          {notificacoes.map((notificacao, index) => (
            <React.Fragment key={notificacao.id}>
              <ListItem
                sx={{
                  bgcolor: notificacao.lida ? 'background.paper' : 'action.hover',
                  borderRadius: 1,
                  mb: 1,
                  border: 1,
                  borderColor: notificacao.lida ? 'divider' : 'primary.light',
                }}
              >
                <Card sx={{ width: '100%', boxShadow: 'none' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Typography variant="body2" sx={{ fontSize: '1.2em' }}>
                            {getIconeTipo(notificacao.tipo)}
                          </Typography>
                          <Typography variant="h6" component="h3">
                            {notificacao.titulo}
                          </Typography>
                          <Chip 
                            label={notificacao.tipo.toUpperCase()} 
                            color={getCorTipo(notificacao.tipo)}
                            size="small"
                          />
                          {!notificacao.lida && (
                            <Chip 
                              label="NOVA" 
                              color="error" 
                              size="small"
                              icon={<NotificationsActive />}
                            />
                          )}
                        </Box>
                        
                        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                          {notificacao.mensagem}
                        </Typography>
                        
                        <Typography variant="caption" color="textSecondary">
                          {new Date(notificacao.data_criacao).toLocaleString('pt-BR')}
                          {notificacao.lida && notificacao.data_leitura && (
                            <span> • Lida em {new Date(notificacao.data_leitura).toLocaleString('pt-BR')}</span>
                          )}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, ml: 2 }}>
                        {!notificacao.lida && (
                          <Tooltip title="Marcar como lida">
                            <IconButton 
                              size="small" 
                              color="primary"
                              onClick={() => marcarComoLida(notificacao.id)}
                            >
                              <Check />
                            </IconButton>
                          </Tooltip>
                        )}
                        <Tooltip title="Deletar">
                          <IconButton 
                            size="small" 
                            color="error"
                            onClick={() => {
                              setSelectedNotif(notificacao);
                              setOpenDialog(true);
                            }}
                          >
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </ListItem>
              {index < notificacoes.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      )}

      {/* Dialog de Confirmação */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <Typography>
            Tem certeza que deseja deletar a notificação "{selectedNotif?.titulo}"?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button 
            color="error" 
            onClick={() => deletarNotificacao(selectedNotif?.id)}
            variant="contained"
          >
            Deletar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Notificacoes;