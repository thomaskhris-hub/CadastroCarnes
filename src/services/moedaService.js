import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5296/api"
});


export async function buscarCotacao(moeda) {

    const response = await api.get(
        `/moedas/${moeda}`
    );

    return response.data;
}