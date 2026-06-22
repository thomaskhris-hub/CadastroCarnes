import {
    Box,
    Typography,
    Card,
    CardContent,
    Grid
} from "@mui/material";


import {
    People,
    Restaurant,
    ShoppingCart,
    Inventory
} from "@mui/icons-material";


import { useEffect, useState } from "react";


import { listarCarnes } from "../services/carneService";
import { listarCompradores } from "../services/compradorService";
import { listarPedidos } from "../services/pedidoService";




function Home(){


    const [cards,setCards] = useState([

        {
            title:"Compradores",
            value:0,
            icon:<People/>,
            color:"#1976d2"
        },

        {
            title:"Carnes Cadastradas",
            value:0,
            icon:<Restaurant/>,
            color:"#2e7d32"
        },

        {
            title:"Pedidos",
            value:0,
            icon:<ShoppingCart/>,
            color:"#ed6c02"
        },

        {
            title:"Estoque",
            value:"0 kg",
            icon:<Inventory/>,
            color:"#9c27b0"
        }

    ]);




    useEffect(()=>{


        async function carregarDados(){


            try {


                const carnes = await listarCarnes();

                const compradores = await listarCompradores();

                const pedidos = await listarPedidos();



                setCards([

                    {
                        title:"Compradores",
                        value:compradores.length,
                        icon:<People/>,
                        color:"#1976d2"
                    },


                    {
                        title:"Carnes Cadastradas",
                        value:carnes.length,
                        icon:<Restaurant/>,
                        color:"#2e7d32"
                    },


                    {
                        title:"Pedidos",
                        value:pedidos.length,
                        icon:<ShoppingCart/>,
                        color:"#ed6c02"
                    },


                    {
                        title:"Estoque",
                        value:`${carnes.length} itens`,
                        icon:<Inventory/>,
                        color:"#9c27b0"
                    }

                ]);



            } catch(error){

                console.log("Erro ao carregar dashboard", error);

            }


        }



        carregarDados();


    },[]);






    return (

        <Box>


            <Typography
                variant="h3"
                sx={{
                    fontWeight:"bold",
                    color:"#006633",
                    mb:1
                }}
            >

                🥩 Minerva Foods

            </Typography>




            <Typography
                variant="h5"
                sx={{
                    color:"#555",
                    mb:5
                }}
            >

                Sistema de Gestão

            </Typography>






            <Grid container spacing={3}>


                {

                    cards.map((card)=>(


                        <Grid

                            item

                            xs={12}

                            sm={6}

                            md={3}

                            key={card.title}

                        >


                            <Card

                                sx={{

                                    borderRadius:3,

                                    boxShadow:
                                    "0 4px 15px rgba(0,0,0,.1)"

                                }}

                            >


                                <CardContent>


                                    <Box

                                        sx={{

                                            display:"flex",

                                            alignItems:"center",

                                            gap:2

                                        }}

                                    >



                                        <Box

                                            sx={{

                                                background:card.color,

                                                color:"#fff",

                                                borderRadius:"50%",

                                                width:50,

                                                height:50,

                                                display:"flex",

                                                alignItems:"center",

                                                justifyContent:"center"

                                            }}

                                        >

                                            {card.icon}


                                        </Box>




                                        <Box>


                                            <Typography

                                                variant="h5"

                                                fontWeight="bold"

                                            >

                                                {card.value}


                                            </Typography>



                                            <Typography

                                                color="text.secondary"

                                            >

                                                {card.title}


                                            </Typography>


                                        </Box>



                                    </Box>



                                </CardContent>


                            </Card>


                        </Grid>


                    ))


                }



            </Grid>


        </Box>


    );

}



export default Home;