import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5296/api"
});

export async function listarCompradores() {
    const response = await api.get("/Compradores");
    return response.data;
}

export async function criarComprador(comprador) {
    const response = await api.post("/Compradores", comprador);
    return response.data;
}

export async function atualizarComprador(id, comprador) {
    await api.put(`/Compradores/${id}`, comprador);
}

export async function excluirComprador(id) {
    await api.delete(`/Compradores/${id}`);
}