import { useState } from "react";
import api from "../services/api.js";

const CadastroLicitacao = () => {
  const [formData, setFormData] = useState({
    numero_processo: "",
    modalidade: "",
    objeto: "",
    orgao_responsavel: "",
    data_abertura: "",
    status: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/licitacoes/", formData);
      alert("Licitação cadastrada com sucesso!");
      setFormData({
        numero_processo: "",
        modalidade: "",
        objeto: "",
        orgao_responsavel: "",
        data_abertura: "",
        status: "",
      });
    } catch (error) {
      console.error("Erro ao cadastrar licitação", error);
      alert("Erro ao cadastrar licitação.");
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-center">Cadastro de Licitação</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="numero_processo"
          placeholder="Número do Processo"
          value={formData.numero_processo}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="modalidade"
          placeholder="Modalidade"
          value={formData.modalidade}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="objeto"
          placeholder="Objeto"
          value={formData.objeto}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="orgao_responsavel"
          placeholder="Órgão Responsável"
          value={formData.orgao_responsavel}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="date"
          name="data_abertura"
          value={formData.data_abertura}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Selecione o Status</option>
          <option value="Aberto">Aberto</option>
          <option value="Encerrado">Encerrado</option>
        </select>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Cadastrar
        </button>
      </form>
    </div>
  );
};

export default CadastroLicitacao;