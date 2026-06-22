import { 
    useEffect, 
    useMemo, 
    useState 
} from "react";


import { MaterialReactTable } from "material-react-table";


import {
    listarCarnes,
    criarCarne,
    atualizarCarne,
    excluirCarne
} from "../services/carneService";



import {

    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    Box,
    Typography,
    Paper

} from "@mui/material";




function Carnes(){


    const [carnes,setCarnes] = useState([]);

    const [open,setOpen] = useState(false);

    const [editando,setEditando] = useState(null);



    const [form,setForm] = useState({

        descricao:"",
        origem:0

    });





    async function carregar(){

        const dados = await listarCarnes();

        setCarnes(dados);

    }





    useEffect(()=>{

        carregar();

    },[]);






    function novo(){


        setEditando(null);


        setForm({

            descricao:"",
            origem:0

        });


        setOpen(true);


    }





    function editar(carne){


        setEditando(carne.id);


        setForm({

            descricao:carne.descricao,

            origem:carne.origem

        });


        setOpen(true);


    }







    async function salvar(){


        if(editando){


            await atualizarCarne(
                editando,
                form
            );


        }else{


            await criarCarne(form);


        }



        setOpen(false);


        carregar();


    }







    async function remover(id){


        if(confirm("Deseja excluir esta carne?")){


            await excluirCarne(id);


            carregar();


        }


    }








    const columns = useMemo(()=>[


        {
            accessorKey:"id",
            header:"Código"
        },


        {
            accessorKey:"descricao",
            header:"Descrição"
        },


        {
            accessorKey:"origem",
            header:"Origem",

            Cell:({cell})=>

                cell.getValue()===0

                ?

                "Nacional"

                :

                "Importada"

        }



    ],[]);









    return (



        <Box>


            {/* CABEÇALHO */}


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

                        🥩 Cadastro de Carnes

                    </Typography>



                    <Typography

                        color="text.secondary"

                    >

                        Gerenciamento dos produtos cadastrados

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

                    Nova Carne

                </Button>



            </Box>









            {/* TABELA */}



            <Paper


                sx={{


                    borderRadius:3,

                    overflow:"hidden",

                    boxShadow:
                    "0 4px 15px rgba(0,0,0,.08)"


                }}


            >



                <MaterialReactTable


                    columns={columns}


                    data={carnes}


                    enableRowActions



                    renderRowActions={({row})=>(


                        <Box>



                            <Button

                                size="small"

                                onClick={()=>editar(row.original)}

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









            {/* MODAL */}



            <Dialog

                open={open}

                onClose={()=>setOpen(false)}

            >



                <DialogTitle>


                    {

                    editando

                    ?

                    "Editar Carne"

                    :

                    "Nova Carne"

                    }



                </DialogTitle>





                <DialogContent>


                    <TextField


                        label="Descrição"


                        fullWidth


                        margin="normal"


                        value={form.descricao}



                        onChange={e=>

                            setForm({

                                ...form,

                                descricao:e.target.value

                            })

                        }


                    />






                    <TextField


                        select


                        label="Origem"


                        fullWidth


                        value={form.origem}



                        onChange={e=>

                            setForm({

                                ...form,

                                origem:Number(e.target.value)

                            })

                        }



                    >


                        <MenuItem value={0}>

                            Nacional

                        </MenuItem>


                        <MenuItem value={1}>

                            Importada

                        </MenuItem>



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



export default Carnes;