import {
    AppBar,
    Toolbar,
    Typography,
    Box,
    Button
} from "@mui/material";


import {
    Outlet,
    useNavigate,
    useLocation
} from "react-router-dom";



function Layout(){


    const navigate = useNavigate();

    const location = useLocation();



    const menus = [

        {
            text:"Home",
            path:"/"
        },

        {
            text:"Cadastro de Carnes",
            path:"/carnes"
        },

        {
            text:"Compradores",
            path:"/compradores"
        },

        {
            text:"Pedidos",
            path:"/pedidos"
        },

          {
            text:"Localidades",
            path:"/localidades"
        }

    ];



    return (


        <Box

            sx={{

                minHeight:"100vh",

                background:"#f4f6f8"

            }}

        >



            {/* MENU SUPERIOR */}


            <AppBar


                position="fixed"


                sx={{


                    background:"#006633",


                    boxShadow:"0 2px 8px rgba(0,0,0,.2)"


                }}


            >


                <Toolbar>



                    <Typography


                        variant="h6"


                        sx={{

                            fontWeight:"bold",

                            mr:5,

                            whiteSpace:"nowrap"

                        }}



                    >

                        🥩 Minerva Foods


                    </Typography>





                    <Box

                        sx={{

                            display:"flex",

                            gap:1

                        }}

                    >


                        {

                            menus.map((item)=>(


                                <Button


                                    key={item.path}



                                    onClick={()=>navigate(item.path)}



                                    sx={{



                                        color:"#fff",


                                        fontWeight:"bold",



                                        background:

                                        location.pathname === item.path

                                        ?

                                        "#00a859"

                                        :

                                        "transparent",



                                        "&:hover":{

                                            background:"#008f4c"

                                        }



                                    }}



                                >

                                    {item.text}


                                </Button>



                            ))


                        }



                    </Box>




                </Toolbar>



            </AppBar>







            {/* CONTEÚDO */}



            <Box


                component="main"


                sx={{


                    padding:4,


                    paddingTop:"100px",



                    minHeight:"100vh"



                }}


            >


                <Outlet />


            </Box>





        </Box>



    );


}


export default Layout;