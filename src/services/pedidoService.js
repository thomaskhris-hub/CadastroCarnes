import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5296/api"
});

export async function listarPedidos() {
    const response = await api.get("/Pedidos");
    return response.data;
}

export async function criarPedido(pedido) {
    const response = await api.post("/Pedidos", pedido);
    return response.data;
}

export async function atualizarPedido(id, pedido) {
    await api.put(`/Pedidos/${id}`, pedido);
}

export async function excluirPedido(id) {
    await api.delete(`/Pedidos/${id}`);
}