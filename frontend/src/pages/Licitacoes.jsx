import React, { useEffect, useState } from "react";
import { 
  Box, 
  CircularProgress, 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableRow, 
  Typography, 
  TextField, 
  Button, 
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useLocation } from "react-router-dom";

const Licitacoes = () => {
  const [licitacoes, setLicitacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, licitacao: null });
  const [highlightedLicitacao, setHighlightedLicitacao] = useState(null);
  const location = useLocation();
  const [formData, setFormData] = useState({
    numero_processo: "",
    modalidade: "",
    objeto: "",
    orgao_responsavel: "",
    data_abertura: "",
    data_encerramento: "",
    status: "",
  });

  useEffect(() => {
    const fetchLicitacoes = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/licitacoes/");
        if (!response.ok) {
          throw new Error("Erro ao buscar licitações");
        }
        const data = await response.json();
        setLicitacoes(data);
        
        // Verificar se há um ID na URL para destacar
        const urlParams = new URLSearchParams(location.search);
        const licitacaoId = urlParams.get('id');
        if (licitacaoId) {
          setHighlightedLicitacao(parseInt(licitacaoId));
          // Remover o destaque após 3 segundos
          setTimeout(() => {
            setHighlightedLicitacao(null);
          }, 3000);
        }
      } catch (error) {
        console.error("Erro ao buscar licitações:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLicitacoes();
  }, [location.search]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:8000/licitacoes/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Erro ao cadastrar licitação");
      }

      const newLicitacao = await response.json();
      setLicitacoes([...licitacoes, newLicitacao]); // Atualiza a lista com a nova licitação
      setFormData({
        numero_processo: "",
        modalidade: "",
        objeto: "",
        orgao_responsavel: "",
        data_abertura: "",
        data_encerramento: "",
        status: "",
      }); // Limpa o formulário
    } catch (error) {
      console.error("Erro ao cadastrar licitação:", error);
    }
  };

  const handleDeleteClick = (licitacao) => {
    setDeleteDialog({ open: true, licitacao });
  };

  const handleDeleteConfirm = async () => {
    const { licitacao } = deleteDialog;
    try {
      const response = await fetch(`http://127.0.0.1:8000/licitacoes/${licitacao.id_licitacao}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Erro ao deletar licitação");
      }

      // Atualiza a lista removendo a licitação deletada
      setLicitacoes(licitacoes.filter(l => l.id_licitacao !== licitacao.id_licitacao));
      setDeleteDialog({ open: false, licitacao: null });
    } catch (error) {
      console.error("Erro ao deletar licitação:", error);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, licitacao: null });
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Licitações
      </Typography>

      {/* Formulário para cadastro */}
      <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
        <TextField
          label="Número do Processo"
          name="numero_processo"
          value={formData.numero_processo}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Modalidade"
          name="modalidade"
          value={formData.modalidade}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Objeto"
          name="objeto"
          value={formData.objeto}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Órgão Responsável"
          name="orgao_responsavel"
          value={formData.orgao_responsavel}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Data de Abertura"
          name="data_abertura"
          type="date"
          value={formData.data_abertura}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          label="Data de Encerramento"
          name="data_encerramento"
          type="date"
          value={formData.data_encerramento}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          label="Status"
          name="status"
          value={formData.status}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
          Cadastrar Licitação
        </Button>
      </Box>

      {/* Tabela de licitações */}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Número do Processo</TableCell>
            <TableCell>Modalidade</TableCell>
            <TableCell>Objeto</TableCell>
            <TableCell>Órgão Responsável</TableCell>
            <TableCell>Data de Abertura</TableCell>
            <TableCell>Data de Encerramento</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {licitacoes.map((licitacao) => (
            <TableRow 
              key={licitacao.id_licitacao}
              sx={{
                backgroundColor: highlightedLicitacao === licitacao.id_licitacao 
                  ? 'rgba(25, 118, 210, 0.1)' 
                  : 'inherit',
                transition: 'background-color 0.3s ease',
                '&:hover': {
                  backgroundColor: highlightedLicitacao === licitacao.id_licitacao 
                    ? 'rgba(25, 118, 210, 0.15)' 
                    : 'rgba(0, 0, 0, 0.04)'
                }
              }}
            >
              <TableCell>{licitacao.id_licitacao}</TableCell>
              <TableCell>{licitacao.numero_processo}</TableCell>
              <TableCell>{licitacao.modalidade}</TableCell>
              <TableCell>{licitacao.objeto}</TableCell>
              <TableCell>{licitacao.orgao_responsavel}</TableCell>
              <TableCell>{licitacao.data_abertura}</TableCell>
              <TableCell>{licitacao.data_encerramento || "N/A"}</TableCell>
              <TableCell>{licitacao.status}</TableCell>
              <TableCell>
                <IconButton 
                  color="error" 
                  onClick={() => handleDeleteClick(licitacao)}
                  title="Deletar licitação"
                >
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Modal de confirmação de delete */}
      <Dialog
        open={deleteDialog.open}
        onClose={handleDeleteCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Confirmar exclusão
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Tem certeza que deseja deletar a licitação "{deleteDialog.licitacao?.numero_processo}"?
            Esta ação não pode ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Deletar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Licitacoes;
