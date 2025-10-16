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

const Contratos = () => {
  const [contratos, setContratos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, contrato: null });
  const [formData, setFormData] = useState({
    numero_contrato: "",
    licitacao_id: "",
    objeto: "",
    fornecedor: "",
    valor_total: "",
    data_assinatura: "",
    data_inicio: "",
    data_fim: "",
    status: "Ativo",
  });

  useEffect(() => {
    const fetchContratos = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/contratos/");
        if (!response.ok) {
          throw new Error("Erro ao buscar contratos");
        }
        const data = await response.json();
        setContratos(data);
      } catch (error) {
        console.error("Erro ao buscar contratos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContratos();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:8000/contratos/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Erro ao cadastrar contrato");
      }

      const newContrato = await response.json();
      setContratos([...contratos, newContrato]); // Atualiza a lista com o novo contrato
      setFormData({
        numero_contrato: "",
        licitacao_id: "",
        objeto: "",
        fornecedor: "",
        valor_total: "",
        data_assinatura: "",
        data_inicio: "",
        data_fim: "",
        status: "Ativo",
      }); // Limpa o formulário
    } catch (error) {
      console.error("Erro ao cadastrar contrato:", error);
    }
  };

  const handleDeleteClick = (contrato) => {
    setDeleteDialog({ open: true, contrato });
  };

  const handleDeleteConfirm = async () => {
    const { contrato } = deleteDialog;
    try {
      const response = await fetch(`http://127.0.0.1:8000/contratos/${contrato.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Erro ao deletar contrato");
      }

      // Atualiza a lista removendo o contrato deletado
      setContratos(contratos.filter(c => c.id !== contrato.id));
      setDeleteDialog({ open: false, contrato: null });
    } catch (error) {
      console.error("Erro ao deletar contrato:", error);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, contrato: null });
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
        Contratos
      </Typography>

      {/* Formulário para cadastro */}
      <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
        <TextField
          label="Número do Contrato"
          name="numero_contrato"
          value={formData.numero_contrato}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="ID Contrato"
          name="licitacao_id"
          type="number"
          value={formData.licitacao_id}
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
          label="Fornecedor"
          name="fornecedor"
          value={formData.fornecedor}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Valor Total"
          name="valor_total"
          type="number"
          value={formData.valor_total}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Data de Assinatura"
          name="data_assinatura"
          type="date"
          value={formData.data_assinatura}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          label="Data de Início"
          name="data_inicio"
          type="date"
          value={formData.data_inicio}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          label="Data de Fim"
          name="data_fim"
          type="date"
          value={formData.data_fim}
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
          Cadastrar Contrato
        </Button>
      </Box>

      {/* Tabela de contratos */}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Número do Contrato</TableCell>
            <TableCell>Objeto</TableCell>
            <TableCell>Fornecedor</TableCell>
            <TableCell>Valor</TableCell>
            <TableCell>Data de Início</TableCell>
            <TableCell>Data de Fim</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {contratos.map((contrato) => (
            <TableRow key={contrato.id}>
              <TableCell>{contrato.id}</TableCell>
              <TableCell>{contrato.numero_contrato}</TableCell>
              <TableCell>{contrato.objeto}</TableCell>
              <TableCell>{contrato.fornecedor}</TableCell>
              <TableCell>{contrato.valor_total}</TableCell>
              <TableCell>{contrato.data_inicio}</TableCell>
              <TableCell>{contrato.data_fim || "N/A"}</TableCell>
              <TableCell>{contrato.status}</TableCell>
              <TableCell>
                <IconButton 
                  color="error" 
                  onClick={() => handleDeleteClick(contrato)}
                  title="Deletar contrato"
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
            Tem certeza que deseja deletar o contrato "{deleteDialog.contrato?.numero_contrato}"?
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

export default Contratos;