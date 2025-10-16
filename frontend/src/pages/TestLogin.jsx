import { useState } from "react";
import { Button, TextField, Box, Typography, Alert, Container } from "@mui/material";

const TestLogin = () => {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("123456");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  const testLogin = async () => {
    setResult("");
    setError("");

    try {
      console.log("Testando login...");
      
      const params = new URLSearchParams();
      params.append("username", username);
      params.append("password", password);

      console.log("Enviando para: http://127.0.0.1:8000/login");
      console.log("Dados:", { username, password });

      const response = await fetch("http://127.0.0.1:8000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params,
      });

      console.log("Status:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("Resposta:", data);

        if (data.access_token) {
          localStorage.setItem("token", data.access_token);
          localStorage.setItem("user", JSON.stringify(data.user));
          setResult("✅ Login bem-sucedido! Token salvo. Redirecionando...");
          
          setTimeout(() => {
            window.location.href = "/dashboard";
          }, 2000);
        }
      } else {
        const errorText = await response.text();
        console.error("Erro:", errorText);
        setError(`Erro ${response.status}: ${errorText}`);
      }
    } catch (err) {
      console.error("Erro:", err);
      setError(`Erro de rede: ${err.message}`);
    }
  };

  const clearStorage = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setResult("LocalStorage limpo");
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Teste de Login
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        
        <Button variant="contained" onClick={testLogin}>
          Testar Login
        </Button>
        
        <Button variant="outlined" onClick={clearStorage}>
          Limpar LocalStorage
        </Button>

        {result && <Alert severity="success">{result}</Alert>}
        {error && <Alert severity="error">{error}</Alert>}

        <Typography variant="h6" sx={{ mt: 2 }}>
          Debug Info:
        </Typography>
        <Typography variant="body2">
          Token atual: {localStorage.getItem("token") ? "Existe" : "Não existe"}
        </Typography>
        <Typography variant="body2">
          User atual: {localStorage.getItem("user") || "Não existe"}
        </Typography>
      </Box>
    </Container>
  );
};

export default TestLogin;