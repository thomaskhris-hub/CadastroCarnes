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
    DialogContentText,
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


import {
    listarCompradores
} from "../services/compradorService";




function Localidades(){



    const [estados,setEstados] = useState([]);
    
 
    const [compradores, setCompradores] = useState([]);



    const [openEstado,setOpenEstado] = useState(false);


    const [openCidade,setOpenCidade] = useState(false);




    const [estadoEditando,setEstadoEditando] = useState(null);


    const [cidadeEditando,setCidadeEditando] = useState(null);





    const [estadoSelecionado,setEstadoSelecionado] = useState(null);



  
    const [openAlerta, setOpenAlerta] = useState(false);
    const [tipoAlerta, setTipoAlerta] = useState(""); 
    const [itemSelecionado, setItemSelecionado] = useState(null);




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


        const listaCompradores = await listarCompradores();
        setCompradores(listaCompradores);

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








    function verificarEditarEstado(estado){
      
        const idsCidadesEstado = estado.cidades?.map(c => c.id) || [];
        const possuiComprador = compradores.some(comp => idsCidadesEstado.includes(comp.cidadeId));

        if (possuiComprador) {
            setItemSelecionado(estado);
            setTipoAlerta("blockEstado");
            setOpenAlerta(true);
        } else {
            setEstadoEditando(estado.id);
            setFormEstado({
                nome:estado.nome,
                uf:estado.uf
            });
            setOpenEstado(true);
        }
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









    function verificarExclusaoEstado(estado){
        const idsCidadesEstado = estado.cidades?.map(c => c.id) || [];
        const possuiComprador = compradores.some(comp => idsCidadesEstado.includes(comp.cidadeId));

        setItemSelecionado(estado);
        if (possuiComprador) {
            setTipoAlerta("blockEstado");
        } else {
            setTipoAlerta("deleteEstado");
        }
        setOpenAlerta(true);
    }












    function novaCidade(estado){


        setEstadoSelecionado(estado);


        setCidadeEditando(null);


        setFormCidade({

            nome:""

        });


        setOpenCidade(true);


    }









    function verificarEditarCidade(cidade, estado){
        setEstadoSelecionado(estado);
        const possuiComprador = compradores.some(comp => Number(comp.cidadeId) === Number(cidade.id));

        if (possuiComprador) {
            setItemSelecionado(cidade);
            setTipoAlerta("blockCidade");
            setOpenAlerta(true);
        } else {
            setCidadeEditando(cidade.id);
            setFormCidade({
                nome:cidade.nome
            });
            setOpenCidade(true);
        }
    }









    async function salvarCidade(){



        const city = {


            nome:formCidade.nome,

            estadoId:estadoSelecionado.id


        };





        if(cidadeEditando){


            await atualizarCidade(

                cidadeEditando,

                city

            );


        }else{


            await criarCidade(city);


        }




        setOpenCidade(false);


        carregar();



    }











    function verificarExclusaoCidade(cidade){
        const possuiComprador = compradores.some(comp => Number(comp.cidadeId) === Number(cidade.id));
        
        setItemSelecionado(cidade);
        if (possuiComprador) {
            setTipoAlerta("blockCidade");
        } else {
            setTipoAlerta("deleteCidade");
        }
        setOpenAlerta(true);
    }



   
    async function confirmarAcaoAlerta() {
        if (!itemSelecionado) return;

        if (tipoAlerta === "deleteEstado") {
            await excluirEstado(itemSelecionado.id);
        } else if (tipoAlerta === "deleteCidade") {
            await excluirCidade(itemSelecionado.id);
        }

        setOpenAlerta(false);
        setItemSelecionado(null);
        carregar();
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

onClick={()=>verificarEditarEstado(estado)}

>

<EditIcon/>

</IconButton>



<IconButton

color="error"

onClick={()=>verificarExclusaoEstado(estado)}

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

onClick={()=>verificarEditarCidade(cidade, estado)}

>

Editar

</Button>



<Button

size="small"

color="error"

onClick={()=>verificarExclusaoCidade(cidade)}

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

sx={{ background: "#006633" }}

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

sx={{ background: "#006633" }}

>

Salvar

</Button>



</DialogActions>




</Dialog>





<Dialog
    open={openAlerta}
    onClose={() => setOpenAlerta(false)}
>
    <DialogTitle sx={{ fontWeight: "bold" }}>
        {tipoAlerta.startsWith("block") ? "Ação Bloqueada" : "Confirmar Exclusão"}
    </DialogTitle>
    <DialogContent>
        <DialogContentText>
            {tipoAlerta === "blockEstado" && `O estado "${itemSelecionado?.nome}" possui cidades vinculadas a compradores ativos e não pode ser alterado ou excluído.`}
            {tipoAlerta === "blockCidade" && `A cidade "${itemSelecionado?.nome}" está vinculada a um ou mais compradores cadastrados e não pode ser alterada ou excluída.`}
            {tipoAlerta === "deleteEstado" && `Deseja realmente excluir o estado "${itemSelecionado?.nome}" de forma definitiva?`}
            {tipoAlerta === "deleteCidade" && `Deseja realmente excluir a cidade "${itemSelecionado?.nome}" de forma definitiva?`}
        </DialogContentText>
    </DialogContent>
    <DialogActions sx={{ pb: 2, px: 3 }}>
        {tipoAlerta.startsWith("block") ? (
            <Button onClick={() => setOpenAlerta(false)} variant="contained" sx={{ background: "#006633" }}>
                Entendido
            </Button>
        ) : (
            <>
                <Button onClick={() => setOpenAlerta(false)}>
                    Cancelar
                </Button>
                <Button 
                    onClick={confirmarAcaoAlerta} 
                    color="error" 
                    variant="contained"
                >
                    Excluir
                </Button>
            </>
        )}
    </DialogActions>
</Dialog>




</Box>


);



}



export default Localidades;