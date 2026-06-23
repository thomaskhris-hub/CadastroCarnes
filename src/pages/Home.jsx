import {
    Box,
    Typography,
    Card,
    CardContent,
    Grid,
    Paper,
    List,
    ListItem,
    ListItemText,
    Divider
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

    const [dadosBrutos, setDadosBrutos] = useState({
        compradores: [],
        carnes: [],
        pedidos: []
    });

    const [cardSelecionado, setCardSelecionado] = useState(null);

    const [cards,setCards] = useState([
        {
            id: "compradores",
            title:"Compradores",
            value:0,
            icon:<People/>,
            color:"#1976d2"
        },
        {
            id: "carnes",
            title:"Carnes Cadastradas",
            value:0,
            icon:<Restaurant/>,
            color:"#2e7d32"
        },
        {
            id: "pedidos",
            title:"Pedidos",
            value:0,
            icon:<ShoppingCart/>,
            color:"#ed6c02"
        },
        {
            id: "estoque",
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

                setDadosBrutos({ compradores, carnes, pedidos });

                setCards([
                    {
                        id: "compradores",
                        title:"Compradores",
                        value:compradores.length,
                        icon:<People/>,
                        color:"#1976d2"
                    },
                    {
                        id: "carnes",
                        title:"Carnes Cadastradas",
                        value:carnes.length,
                        icon:<Restaurant/>,
                        color:"#2e7d32"
                    },
                    {
                        id: "pedidos",
                        title:"Pedidos",
                        value:pedidos.length,
                        icon:<ShoppingCart/>,
                        color:"#ed6c02"
                    },
                    {
                        id: "estoque",
                        title:"Estoque",
                        value:`${carnes.length} itens`,
                        icon:<Inventory/>,
                        color:"#9c27b0"
                    }
                ]);

           
                setCardSelecionado("compradores");

            } catch(error){
                console.log("Erro ao carregar dashboard", error);
            }
        }

        carregarDados();

    },[]);

    
    const calcularTotalPedido = (itens) => {
        return (itens?.reduce((soma, item) => soma + Number(item.preco || 0), 0) || 0).toLocaleString(
            "pt-BR", { style: "currency", currency: "BRL" }
        );
    };

    return (
        <Box sx={{ p: 3 }}>

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
                            key={card.id}
                        >
                            <Card
                                onClick={() => setCardSelecionado(card.id)}
                                sx={{
                                    borderRadius:3,
                                    cursor: "pointer",
                                    transition: "transform 0.2s, box-shadow 0.2s",
                                    border: cardSelecionado === card.id ? `2px solid ${card.color}` : "2px solid transparent",
                                    boxShadow: cardSelecionado === card.id 
                                        ? "0 6px 20px rgba(0,0,0,0.15)" 
                                        : "0 4px 15px rgba(0,0,0,.1)",
                                    "&:hover": {
                                        transform: "translateY(-4px)",
                                        boxShadow: "0 6px 20px rgba(0,0,0,0.15)"
                                    }
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

          
            {cardSelecionado && (
                <Paper sx={{ mt: 4, p: 3, borderRadius: 3, boxShadow: "0 4px 15px rgba(0,0,0,.05)" }}>
                    
                    {cardSelecionado === "compradores" && (
                        <>
                            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2, color: "#1976d2" }}>
                                👥 Relação de Compradores
                            </Typography>
                            <Divider sx={{ mb: 1 }} />
                            <List>
                                {dadosBrutos.compradores.length === 0 ? (
                                    <Typography color="text.secondary">Nenhum comprador cadastrado.</Typography>
                                ) : (
                                    dadosBrutos.compradores.map((comp) => (
                                        <ListItem key={comp.id} disablePadding sx={{ py: 1 }}>
                                            <ListItemText 
                                                primary={comp.nome} 
                                                secondary={`ID único do cliente: #${comp.id}`} 
                                            />
                                        </ListItem>
                                    ))
                                )}
                            </List>
                        </>
                    )}

                    {cardSelecionado === "carnes" && (
                        <>
                            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2, color: "#2e7d32" }}>
                                🥩 Carnes no Catálogo
                            </Typography>
                            <Divider sx={{ mb: 1 }} />
                            <List>
                                {dadosBrutos.carnes.length === 0 ? (
                                    <Typography color="text.secondary">Nenhuma carne cadastrada.</Typography>
                                ) : (
                                    dadosBrutos.carnes.map((carne) => (
                                        <ListItem key={carne.id} disablePadding sx={{ py: 1 }}>
                                            <ListItemText 
                                                primary={carne.descricao} 
                                                secondary={`Origem: ${carne.origem === 0 ? "Nacional" : "Importada"} | Código: ${carne.id}`} 
                                            />
                                        </ListItem>
                                    ))
                                )}
                            </List>
                        </>
                    )}

                    {cardSelecionado === "pedidos" && (
                        <>
                            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2, color: "#ed6c02" }}>
                                🛒 Resumo dos Últimos Pedidos
                            </Typography>
                            <Divider sx={{ mb: 1 }} />
                            <List>
                                {dadosBrutos.pedidos.length === 0 ? (
                                    <Typography color="text.secondary">Nenhum pedido efetuado.</Typography>
                                ) : (
                                    dadosBrutos.pedidos.map((ped) => {
                                        const comprador = dadosBrutos.compradores.find(c => c.id === ped.compradorId);
                                        return (
                                            <ListItem key={ped.id} disablePadding sx={{ py: 1 }}>
                                                <ListItemText 
                                                    primary={`Pedido #${ped.id} — Cliente: ${comprador?.nome ?? "Desconhecido"}`} 
                                                    secondary={`Quantidade de Itens: ${ped.itens?.length ?? 0} | Valor Total: ${calcularTotalPedido(ped.itens)}`} 
                                                />
                                            </ListItem>
                                        );
                                    })
                                )}
                            </List>
                        </>
                    )}

                    {cardSelecionado === "estoque" && (
                        <>
                            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2, color: "#9c27b0" }}>
                                📦 Monitoramento de Produtos (Estoque)
                            </Typography>
                            <Divider sx={{ mb: 1 }} />
                            <Typography variant="body1" sx={{ mt: 1 }} color="text.secondary">
                                O estoque atual possui mapeado um total de <strong>{dadosBrutos.carnes.length} variedades</strong> distintas de cortes prontas para comercialização e distribuição nos pedidos de venda.
                            </Typography>
                        </>
                    )}

                </Paper>
            )}

        </Box>
    );
}

export default Home;