import api from "../api/api";


export async function listarCarnes() {
    const response = await api.get("/Carnes");
    return response.data;
}


export async function buscarCarne(id) {
    const response = await api.get(`/Carnes/${id}`);
    return response.data;
}


export async function criarCarne(carne) {
    const response = await api.post("/Carnes", carne);
    return response.data;
}


export async function atualizarCarne(id, carne) {
    await api.put(`/Carnes/${id}`, carne);
}


export async function excluirCarne(id) {
    await api.delete(`/Carnes/${id}`);
}