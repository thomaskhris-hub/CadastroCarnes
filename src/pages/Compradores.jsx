import {
    useEffect,
    useMemo,
    useState
} from "react";


import {
    MaterialReactTable
} from "material-react-table";


import {
    listarCompradores,
    criarComprador,
    atualizarComprador,
    excluirComprador
} from "../services/compradorService";


import {
    listarCidades
} from "../services/cidadeService";



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
    MenuItem

} from "@mui/material";







function Compradores(){


    const [compradores,setCompradores] = useState([]);


    const [cidades,setCidades] = useState([]);


    const [open,setOpen] = useState(false);


    const [editando,setEditando] = useState(null);



    const [form,setForm] = useState({

        nome:"",
        documento:"",
        cidadeId:""

    });









    async function carregar(){


        const dados =
            await listarCompradores();


        setCompradores(dados);



        const listaCidades =
            await listarCidades();


        setCidades(listaCidades);


    }







    useEffect(()=>{


        carregar();


    },[]);









    function novo(){


        setEditando(null);



        setForm({

            nome:"",
            documento:"",
            cidadeId:""

        });



        setOpen(true);


    }









    function editar(comprador){


        setEditando(comprador.id);



        setForm({

            nome:comprador.nome,

            documento:comprador.documento,

            cidadeId:comprador.cidadeId

        });



        setOpen(true);


    }









    async function salvar(){



        if(editando){


            await atualizarComprador(

                editando,

                form

            );


        }else{


            await criarComprador(form);


        }




        setOpen(false);


        carregar();


    }









    async function remover(id){



        if(confirm("Deseja excluir este comprador?")){


            await excluirComprador(id);


            carregar();


        }


    }









    const columns = useMemo(()=>[



        {

            accessorKey:"id",

            header:"Código"

        },



        {

            accessorKey:"nome",

            header:"Nome"

        },



        {

            accessorKey:"documento",

            header:"Documento"

        },



        {

            accessorFn:(row)=>

                row.cidade?.nome ?? "",


            id:"cidade",


            header:"Cidade"

        }



    ],[]);









    return (



<Box sx={{p:3}}>





<Box

sx={{

display:"flex",

justifyContent:"space-between",

alignItems:"center",

mb:4

}}

>



<Box>


<Typography

variant="h4"

sx={{

fontWeight:"bold",

color:"#006633"

}}

>

👥 Cadastro de Compradores

</Typography>



<Typography color="text.secondary">

Gerenciamento dos compradores cadastrados

</Typography>



</Box>






<Button

variant="contained"

onClick={novo}


sx={{

background:"#006633",

"&:hover":{

background:"#004d26"

}

}}

>

Novo Comprador

</Button>



</Box>









<Paper

sx={{

borderRadius:3,

overflow:"hidden",

boxShadow:"0 4px 15px rgba(0,0,0,.08)"

}}

>



<MaterialReactTable


columns={columns}


data={compradores}


enableRowActions



renderRowActions={({row})=>(


<Box>


<Button

size="small"

onClick={()=>

editar(row.original)

}

>

Editar

</Button>





<Button

size="small"

color="error"

onClick={()=>


remover(row.original.id)

}

>

Excluir

</Button>



</Box>


)}


/>



</Paper>












<Dialog


open={open}


onClose={()=>setOpen(false)}


fullWidth


>



<DialogTitle>


{

editando

?

"Editar Comprador"

:

"Novo Comprador"

}


</DialogTitle>








<DialogContent>






<TextField


fullWidth


margin="normal"


label="Nome"



value={form.nome}



onChange={(e)=>


setForm({

...form,

nome:e.target.value

})


}


/>









<TextField


fullWidth


margin="normal"


label="Documento"



value={form.documento}



onChange={(e)=>


setForm({

...form,

documento:e.target.value

})


}


/>












<TextField


select


fullWidth


margin="normal"


label="Cidade"



value={form.cidadeId}



onChange={(e)=>


setForm({

...form,

cidadeId:Number(e.target.value)

})


}


>



{

cidades.map(c=>(


<MenuItem

key={c.id}

value={c.id}

>


{c.nome}


</MenuItem>


))


}



</TextField>







</DialogContent>










<DialogActions>



<Button

onClick={()=>setOpen(false)}

>

Cancelar

</Button>






<Button


variant="contained"


onClick={salvar}


sx={{

background:"#006633"

}}

>

Salvar

</Button>





</DialogActions>






</Dialog>






</Box>


    );


}



export default Compradores;