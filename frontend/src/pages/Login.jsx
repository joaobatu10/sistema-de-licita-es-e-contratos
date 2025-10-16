import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  CircularProgress,
  Alert,
} from "@mui/material";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Criando os dados no formato x-www-form-urlencoded
      const params = new URLSearchParams();
      params.append("username", username);
      params.append("password", password);

      const response = await axios.post("http://127.0.0.1:8000/login", params, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      if (response.data.access_token) {
        // Salvar token e dados do usuário
        localStorage.setItem("token", response.data.access_token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        
        console.log("Login bem-sucedido, redirecionando...");
        
        // Forçar atualização da página para garantir que o estado seja atualizado
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 100);
      }
    } catch (error) {
      console.error("Erro de login:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
      }
      setError("❌ Erro ao fazer login! Verifique suas credenciais.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        bgcolor: "#f4f6f8"
      }}
    >
      <Paper elevation={0} sx={{ 
        padding: 4, 
        width: "100%", 
        maxWidth: 400,
        borderRadius: 3,
        boxShadow: 3,
        background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)'
      }}>
        <Typography variant="h4" textAlign="center" gutterBottom fontWeight="bold" sx={{
          background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
          backgroundClip: 'text',
          color: 'transparent',
          display: 'inline-block',
          width: '100%'
        }}>
          🔐 Login
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}

        <Box component="form" onSubmit={handleLogin} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Usuário"
            variant="outlined"
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <TextField
            label="Senha"
            type="password"
            variant="outlined"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading} sx={{
            borderRadius: 2,
            py: 1.5,
            background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
            boxShadow: 2,
            '&:hover': {
              background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 100%)',
              boxShadow: 3,
              transform: 'translateY(-1px)'
            },
            transition: 'all 0.2s ease'
          }}>
            {loading ? <CircularProgress size={24} color="inherit" /> : "Entrar"}
          </Button>
          
          <Typography variant="body2" textAlign="center" sx={{ mt: 2 }}>
            Não tem uma conta?{" "}
            <Link to="/register" style={{ textDecoration: "none", color: "#1976d2" }}>
              Criar Conta
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
