import { 
    useEffect,
    useMemo,
    useState
} from "react";


import {
    MaterialReactTable
} from "material-react-table";


import {

    Box,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    TextField,
    MenuItem,
    IconButton,
    Divider,
    Typography,
    Paper

} from "@mui/material";


import DeleteIcon from "@mui/icons-material/Delete";


import { NumericFormat } from "react-number-format";



import {

    listarPedidos,
    criarPedido,
    excluirPedido

} from "../services/pedidoService";



import {
    listarCompradores
} from "../services/compradorService";


import {
    listarCarnes
} from "../services/carneService";





function Pedidos(){



    const [pedidos,setPedidos] = useState([]);

    const [compradores,setCompradores] = useState([]);

    const [carnes,setCarnes] = useState([]);


    const [open,setOpen] = useState(false);


   
    const [openDelete, setOpenDelete] = useState(false);
    const [idParaExcluir, setIdParaExcluir] = useState(null);




    const [form,setForm] = useState({


        compradorId:"",


        itens:[

            {

                carneId:"",

                preco:"",

                moeda:0

            }

        ]

    });







    async function carregar(){


        const pedidos =
            await listarPedidos();


        setPedidos(pedidos);




        const compradores =
            await listarCompradores();


        setCompradores(compradores);




        const carnes =
            await listarCarnes();


        setCarnes(carnes);


    }







    useEffect(()=>{


        carregar();


    },[]);









    function novoPedido(){


        setForm({

            compradorId:"",

            itens:[

                {

                    carneId:"",

                    preco:"",

                    moeda:0

                }

            ]

        });



        setOpen(true);


    }







    function adicionarItem(){


        setForm({

            ...form,


            itens:[

                ...form.itens,


                {

                    carneId:"",

                    preco:"",

                    moeda:0

                }

            ]


        });


    }







    function removerItem(index){


        const lista=[...form.itens];


        lista.splice(index,1);



        setForm({

            ...form,

            itens:lista

        });


    }








    function alterarItem(index,campo,valor){


        const lista=[...form.itens];


        lista[index][campo]=valor;



        setForm({

            ...form,

            itens:lista

        });


    }








    async function salvar(){


        const pedidoEnviar={


            compradorId:Number(form.compradorId),


            itens:

                form.itens.map(item=>({

                    carneId:Number(item.carneId),

                    preco:Number(item.preco),

                    moeda:0

                }))


        };



        await criarPedido(pedidoEnviar);



        setOpen(false);


        carregar();


    }








    
    function confirmarRemover(id){
        setIdParaExcluir(id);
        setOpenDelete(true);
    }


   
    async function executarRemocao(){
        if(idParaExcluir){
            await excluirPedido(idParaExcluir);
            setOpenDelete(false);
            setIdParaExcluir(null);
            carregar();
        }
    }








    const columns = useMemo(()=>[



        {

            accessorKey:"id",

            header:"Pedido"

        },



        {


            accessorFn:(row)=>{


                const comprador =
                    compradores.find(
                        x=>x.id===row.compradorId
                    );


                return comprador?.nome ?? "";


            },


            id:"comprador",


            header:"Comprador"


        },




        {

          
            accessorFn:(row)=>{
                if (!row.itens || row.itens.length === 0) return "Nenhuma";
                
                const nomesDasCarnes = row.itens.map(item => {
                    const carneEncontrada = carnes.find(c => Number(c.id) === Number(item.carneId));
                    return carneEncontrada ? carneEncontrada.descricao : `Carne (${item.carneId})`;
                });

                return nomesDasCarnes.join(", ");
            },


            id:"quantidade",


            header:"Carnes"


        },




        {


            accessorFn:(row)=>{


                const total =

                    row.itens?.reduce(

                        (soma,item)=>

                        soma +
                        Number(item.preco),


                        0

                    ) || 0;



                return total.toLocaleString(

                    "pt-BR",

                    {

                        style:"currency",

                        currency:"BRL"

                    }

                );


            },


            id:"valor",


            header:"Valor Total"


        }




    
    ],[compradores, carnes]);









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

                        🛒 Pedidos


                    </Typography>




                    <Typography


                        color="text.secondary"

                    >

                        Gerenciamento de pedidos de carnes


                    </Typography>



                </Box>





                <Button


                    variant="contained"


                    onClick={novoPedido}



                    sx={{


                        background:"#006633",


                        "&:hover":{

                            background:"#004d26"

                        }


                    }}



                >

                    Novo Pedido


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


                    data={pedidos}


                    enableRowActions



                    renderRowActions={({row})=>(



                        <Button

                            color="error"

                            size="small"

                            onClick={()=>
                                confirmarRemover(row.original.id)
                            }

                        >

                            Excluir

                        </Button>


                    )}


                />



            </Paper>













            <Dialog


                open={open}

                onClose={()=>setOpen(false)}

                fullWidth

                maxWidth="md"

            >



                <DialogTitle>

                    Novo Pedido

                </DialogTitle>





                <DialogContent>




                    <TextField


                        select


                        fullWidth


                        margin="normal"


                        label="Comprador"



                        value={form.compradorId}



                        onChange={(e)=>

                            setForm({

                                ...form,

                                compradorId:e.target.value

                            })

                        }



                    >


                        {

                        compradores.map(c=>(

                            <MenuItem

                                key={c.id}

                                value={c.id}

                            >

                                {c.nome}


                            </MenuItem>


                        ))

                        }


                    </TextField>







                    <Typography


                        variant="h6"

                        sx={{mt:3}}

                    >

                        Carnes


                    </Typography>







                    {

                    form.itens.map((item,index)=>(


                        <Box


                            key={index}


                            sx={{


                                mt:2,


                                display:"flex",


                                gap:2,


                                alignItems:"center"


                            }}


                        >





                            <TextField


                                select


                                label="Carne"


                                fullWidth



                                value={item.carneId}



                                onChange={(e)=>

                                    alterarItem(

                                        index,

                                        "carneId",

                                        e.target.value

                                    )

                                }



                            >


                                {

                                carnes.map(c=>(


                                    <MenuItem

                                        key={c.id}

                                        value={c.id}

                                    >

                                        {c.descricao}

                                    </MenuItem>


                                ))

                                }



                            </TextField>







                            <NumericFormat


                                customInput={TextField}


                                label="Preço"


                                prefix="R$ "


                                thousandSeparator="."


                                decimalSeparator=","


                                decimalScale={2}


                                fixedDecimalScale


                                value={item.preco}



                                onValueChange={(values)=>

                                    alterarItem(

                                        index,

                                        "preco",

                                        values.value

                                    )

                                }


                            />







                            <IconButton

                                color="error"

                                onClick={()=>
                                    removerItem(index)
                                }

                            >

                                <DeleteIcon/>


                            </IconButton>




                        </Box>


                    ))

                    }







                    <Button


                        sx={{mt:3}}


                        variant="outlined"


                        onClick={adicionarItem}


                    >

                        + Adicionar Carne


                    </Button>







                    <Divider sx={{my:3}}/>







                    <Typography>


                        Total:

                        {

                        form.itens.reduce(

                            (a,b)=>

                            a+Number(b.preco||0),


                            0


                        ).toLocaleString(

                            "pt-BR",

                            {

                                style:"currency",

                                currency:"BRL"

                            }

                        )


                        }


                    </Typography>





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
                    Confirmar Exclusão
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Deseja excluir este pedido? Esta ação não podera ser desfeita!
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ pb: 2, px: 3 }}>
                    <Button onClick={() => setOpenDelete(false)}>
                        Cancelar
                    </Button>
                    <Button 
                        onClick={executarRemocao} 
                        color="error" 
                        variant="contained" 
                        autoFocus
                    >
                        Excluir
                    </Button>
                </DialogActions>
            </Dialog>


        </Box>


    );


}


export default Pedidos;