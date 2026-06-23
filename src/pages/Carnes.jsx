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
    listarPedidos
} from "../services/pedidoService";



import {

    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    TextField,
    MenuItem,
    Box,
    Typography,
    Paper

} from "@mui/material";




function Carnes(){


    const [carnes,setCarnes] = useState([]);

    
    const [pedidos, setPedidos] = useState([]);

    const [open,setOpen] = useState(false);

    const [editando,setEditando] = useState(null);


   
    const [openDelete, setOpenDelete] = useState(false);
    const [carneSelecionada, setCarneSelecionada] = useState(null);
    const [temPedidoVinculado, setTemPedidoVinculado] = useState(false);
    

    const [openEditBlock, setOpenEditBlock] = useState(false);



    const [form,setForm] = useState({

        descricao:"",
        origem:0

    });





    async function carregar(){

        const dados = await listarCarnes();

        setCarnes(dados);


      
        const listaPedidos = await listarPedidos();

        setPedidos(listaPedidos);

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





   
    function verificarEditar(carne){
        const possuiPedido = pedidos.some(pedido => 
            pedido.itens?.some(item => Number(item.carneId) === Number(carne.id))
        );

        if (possuiPedido) {
            setCarneSelecionada(carne);
            setOpenEditBlock(true); 
        } else {
         
            setEditando(carne.id);
            setForm({
                descricao: carne.descricao,
                origem: carne.origem
            });
            setOpen(true);
        }
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







   
    function verificarExclusao(carne){
       
        const possuiPedido = pedidos.some(pedido => 
            pedido.itens?.some(item => Number(item.carneId) === Number(carne.id))
        );

        setCarneSelecionada(carne);
        setTemPedidoVinculado(possuiPedido);
        setOpenDelete(true);
    }



    
    async function executarRemocao(){
        if(carneSelecionada){
            await excluirCarne(carneSelecionada.id);
            setOpenDelete(false);
            setCarneSelecionada(null);
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

                                onClick={()=>verificarEditar(row.original)}

                            >

                                Editar

                            </Button>





                            <Button

                                size="small"

                                color="error"

                                onClick={()=>
                                    verificarExclusao(row.original)
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




          
            <Dialog
                open={openDelete}
                onClose={() => setOpenDelete(false)}
            >
                <DialogTitle sx={{ fontWeight: "bold" }}>
                    {temPedidoVinculado ? "Não é possível excluir" : "Confirmar Exclusão"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {temPedidoVinculado 
                            ? `A carne "${carneSelecionada?.descricao}" já foi adicionada em pedidos do sistema e não pode ser excluída.`
                            : `Deseja realmente excluir a carne "${carneSelecionada?.descricao}"?`
                        }
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ pb: 2, px: 3 }}>
                    {temPedidoVinculado ? (
                        <Button onClick={() => setOpenDelete(false)} variant="contained" sx={{ background: "#006633" }}>
                            Entendido
                        </Button>
                    ) : (
                        <>
                            <Button onClick={() => setOpenDelete(false)}>
                                Cancelar
                            </Button>
                            <Button 
                                onClick={executarRemocao} 
                                color="error" 
                                variant="contained"
                            >
                                Excluir
                            </Button>
                        </>
                    )}
                </DialogActions>
            </Dialog>


          
            <Dialog
                open={openEditBlock}
                onClose={() => setOpenEditBlock(false)}
            >
                <DialogTitle sx={{ fontWeight: "bold" }}>
                    Não é possível editar
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        A carne "{carneSelecionada?.descricao}" já possui movimentações em pedidos existentes. Para não alterar o histórico das vendas, a edição está bloqueada.
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ pb: 2, px: 3 }}>
                    <Button onClick={() => setOpenEditBlock(false)} variant="contained" sx={{ background: "#006633" }}>
                        Entendido
                    </Button>
                </DialogActions>
            </Dialog>


        </Box>



    );


}



export default Carnes;