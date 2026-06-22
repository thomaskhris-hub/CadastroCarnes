const URL = "http://localhost:5296/api/Cidades";



export async function listarCidades(){

    const resposta = await fetch(URL);

    return await resposta.json();

}




export async function criarCidade(cidade){

    const resposta = await fetch(
        URL,
        {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(cidade)
        }
    );


    return await resposta.json();

}





export async function atualizarCidade(id,cidade){

    await fetch(
        `${URL}/${id}`,
        {
            method:"PUT",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(cidade)
        }
    );

}





export async function excluirCidade(id){

    await fetch(
        `${URL}/${id}`,
        {
            method:"DELETE"
        }
    );

}