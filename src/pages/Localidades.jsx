import {
    useEffect,
    useState
} from "react";


import {

    Box,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Typography,
    Paper,
    IconButton,
    Divider

} from "@mui/material";


import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";


import {

    listarEstados,
    criarEstado,
    atualizarEstado,
    excluirEstado

} from "../services/estadoService";


import {

    criarCidade,
    atualizarCidade,
    excluirCidade

} from "../services/cidadeService";






function Localidades(){



    const [estados,setEstados] = useState([]);



    const [openEstado,setOpenEstado] = useState(false);


    const [openCidade,setOpenCidade] = useState(false);




    const [estadoEditando,setEstadoEditando] = useState(null);


    const [cidadeEditando,setCidadeEditando] = useState(null);





    const [estadoSelecionado,setEstadoSelecionado] = useState(null);






    const [formEstado,setFormEstado] = useState({

        nome:"",
        uf:""

    });





    const [formCidade,setFormCidade] = useState({

        nome:""

    });









    async function carregar(){


        const dados =
            await listarEstados();


        setEstados(dados);


    }






    useEffect(()=>{


        carregar();


    },[]);









    function novoEstado(){


        setEstadoEditando(null);


        setFormEstado({

            nome:"",
            uf:""

        });


        setOpenEstado(true);


    }








    function editarEstado(estado){


        setEstadoEditando(estado.id);


        setFormEstado({

            nome:estado.nome,

            uf:estado.uf

        });


        setOpenEstado(true);


    }









    async function salvarEstado(){



        if(estadoEditando){


            await atualizarEstado(

                estadoEditando,

                formEstado

            );


        }else{


            await criarEstado(formEstado);


        }




        setOpenEstado(false);


        carregar();


    }









    async function removerEstado(id){



        if(confirm("Excluir estado?")){


            await excluirEstado(id);


            carregar();


        }


    }












    function novaCidade(estado){


        setEstadoSelecionado(estado);


        setCidadeEditando(null);


        setFormCidade({

            nome:""

        });


        setOpenCidade(true);


    }









    function editarCidade(cidade,estado){


        setEstadoSelecionado(estado);


        setCidadeEditando(cidade.id);


        setFormCidade({

            nome:cidade.nome

        });


        setOpenCidade(true);


    }









    async function salvarCidade(){



        const cidade = {


            nome:formCidade.nome,

            estadoId:estadoSelecionado.id


        };





        if(cidadeEditando){


            await atualizarCidade(

                cidadeEditando,

                cidade

            );


        }else{


            await criarCidade(cidade);


        }




        setOpenCidade(false);


        carregar();



    }











    async function removerCidade(id){



        if(confirm("Excluir cidade?")){


            await excluirCidade(id);


            carregar();


        }


    }












return (

<Box sx={{p:4}}>





<Box

sx={{

display:"flex",

justifyContent:"space-between",

alignItems:"center",

mb:4

}}

>


<Typography

variant="h4"

sx={{

fontWeight:"bold",

color:"#006633"

}}

>

📍 Cadastro de Localidades

</Typography>



<Button

variant="contained"

onClick={novoEstado}

sx={{

background:"#006633"

}}

>

Novo Estado

</Button>



</Box>









{

estados.map(estado=>(



<Paper

key={estado.id}

sx={{

p:3,

mb:3,

borderRadius:3

}}

>



<Box

sx={{

display:"flex",

justifyContent:"space-between"

}}

>


<Box>


<Typography

variant="h5"

fontWeight="bold"

>

{estado.nome} - {estado.uf}

</Typography>



</Box>





<Box>


<IconButton

onClick={()=>editarEstado(estado)}

>

<EditIcon/>

</IconButton>



<IconButton

color="error"

onClick={()=>removerEstado(estado.id)}

>

<DeleteIcon/>

</IconButton>



</Box>


</Box>






<Divider sx={{my:2}}/>






<Typography

fontWeight="bold"

>

Cidades

</Typography>







{

estado.cidades?.map(cidade=>(


<Box

key={cidade.id}

sx={{

display:"flex",

justifyContent:"space-between",

alignItems:"center",

mt:1

}}

>


<Typography>

{cidade.nome}

</Typography>




<Box>


<Button

size="small"

onClick={()=>editarCidade(cidade,estado)}

>

Editar

</Button>



<Button

size="small"

color="error"

onClick={()=>removerCidade(cidade.id)}

>

Excluir

</Button>



</Box>



</Box>


))


}






<Button

sx={{mt:2}}

variant="outlined"

onClick={()=>novaCidade(estado)}

>

+ Nova Cidade

</Button>





</Paper>



))


}













<Dialog

open={openEstado}

onClose={()=>setOpenEstado(false)}

>


<DialogTitle>

{

estadoEditando ?

"Editar Estado"

:

"Novo Estado"

}

</DialogTitle>




<DialogContent>



<TextField

fullWidth

margin="normal"

label="Nome"

value={formEstado.nome}


onChange={(e)=>

setFormEstado({

...formEstado,

nome:e.target.value

})

}


/>






<TextField

fullWidth

margin="normal"

label="UF"

value={formEstado.uf}


onChange={(e)=>

setFormEstado({

...formEstado,

uf:e.target.value

})

}


/>



</DialogContent>






<DialogActions>


<Button

onClick={()=>setOpenEstado(false)}

>

Cancelar

</Button>


<Button

variant="contained"

onClick={salvarEstado}

>

Salvar

</Button>


</DialogActions>



</Dialog>













<Dialog

open={openCidade}

onClose={()=>setOpenCidade(false)}

>


<DialogTitle>

{

cidadeEditando ?

"Editar Cidade"

:

"Nova Cidade"

}

</DialogTitle>





<DialogContent>


<TextField

fullWidth

margin="normal"

label="Cidade"

value={formCidade.nome}


onChange={(e)=>

setFormCidade({

nome:e.target.value

})

}


/>



</DialogContent>






<DialogActions>


<Button

onClick={()=>setOpenCidade(false)}

>

Cancelar

</Button>



<Button

variant="contained"

onClick={salvarCidade}

>

Salvar

</Button>



</DialogActions>




</Dialog>






</Box>


);



}



export default Localidades;