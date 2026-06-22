const URL = "http://localhost:5296/api/Estados";



export async function listarEstados(){

    const resposta = await fetch(URL);

    return await resposta.json();

}



export async function criarEstado(estado){

    const resposta = await fetch(
        URL,
        {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(estado)
        }
    );

    return await resposta.json();

}



export async function atualizarEstado(id,estado){

    await fetch(
        `${URL}/${id}`,
        {
            method:"PUT",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(estado)
        }
    );

}



export async function excluirEstado(id){

    await fetch(
        `${URL}/${id}`,
        {
            method:"DELETE"
        }
    );

}