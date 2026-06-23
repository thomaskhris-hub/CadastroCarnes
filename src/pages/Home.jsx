import { useEffect, useState } from "react";
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
    Divider,
    TextField,
    MenuItem,
    Button
} from "@mui/material";
import {
    People,
    Restaurant,
    ShoppingCart,
    Inventory,
    ClearAll
} from "@mui/icons-material";

import { listarCarnes } from "../services/carneService";
import { listarCompradores } from "../services/compradorService";
import { listarPedidos } from "../services/pedidoService";

function Home() {
    const [indicadores, setIndicadores] = useState([]);
    const [idIndicadorSelecionado, setIdIndicadorSelecionado] = useState(null);
    
    const [compradores, setCompradores] = useState([]);
    const [carnes, setCarnes] = useState([]);
    const [pedidos, setPedidos] = useState([]);

    const [filtroCompradorId, setFiltroCompradorId] = useState("");
    const [filtroCarneId, setFiltroCarneId] = useState("");

    async function carregarIndicadoresDashboard() {
        try {
            const [listaCarnes, listaCompradores, listaPedidos] = await Promise.all([
                listarCarnes(),
                listarCompradores(),
                listarPedidos()
            ]);

            setCarnes(listaCarnes || []);
            setCompradores(listaCompradores || []);
            setPedidos(listaPedidos || []);

            setIndicadores([
                {
                    id: "compradores",
                    titulo: "Compradores",
                    valor: listaCompradores?.length || 0,
                    icon: <People />,
                    cor: "#1976d2"
                },
                {
                    id: "carnes",
                    titulo: "Carnes Cadastradas",
                    valor: listaCarnes?.length || 0,
                    icon: <Restaurant />,
                    cor: "#2e7d32"
                },
                {
                    id: "pedidos",
                    titulo: "Pedidos",
                    valor: listaPedidos?.length || 0,
                    icon: <ShoppingCart />,
                    cor: "#ed6c02"
                },
                {
                    id: "estoque",
                    titulo: "Estoque",
                    valor: `${listaCarnes?.length || 0} itens`,
                    icon: <Inventory />,
                    cor: "#9c27b0"
                }
            ]);

            setIdIndicadorSelecionado("compradores");
        } catch (error) {
            console.error("Erro ao carregar dados do painel:", error);
        }
    }

    useEffect(() => {
        if (filtroCompradorId || filtroCarneId) {
            setIdIndicadorSelecionado("pedidos");
        }
    }, [filtroCompradorId, filtroCarneId]);

    useEffect(() => {
        carregarIndicadoresDashboard();
    }, []);

    const calcularTotalPedido = (itens) => {
        if (!itens || itens.length === 0) return "R$ 0,00";

        const totalConvertido = itens.reduce((soma, item) => {
            const precoBruto = Number(item.preco || 0);
            const valorCotacao = Number(item.moeda) === 0 ? 10000 : Number(item.moeda || 10000);
            const fatiorMoeda = valorCotacao / 10000;

            return soma + (precoBruto * fatiorMoeda);
        }, 0);

        return totalConvertido.toLocaleString("pt-BR", { 
            style: "currency", 
            currency: "BRL" 
        });
    };

    const pedidosFiltrados = pedidos.filter((pedido) => {
        const atendeComprador = filtroCompradorId 
            ? Number(pedido.compradorId) === Number(filtroCompradorId) 
            : true;

        const atendeCarne = filtroCarneId 
            ? pedido.itens?.some(item => Number(item.carneId) === Number(filtroCarneId)) 
            : true;

        return atendeComprador && atendeCarne;
    });

    const limparFiltrosBusca = () => {
        setFiltroCompradorId("");
        setFiltroCarneId("");
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h3" sx={{ fontWeight: "bold", color: "#006633", mb: 1 }}>
                🥩 Minerva Foods
            </Typography>

            <Typography variant="h5" sx={{ color: "#555", mb: 4 }}>
                Sistema de Gestão
            </Typography>

            <Paper 
                elevation={0}
                sx={{ 
                    p: 3, 
                    mb: 4, 
                    borderRadius: 3, 
                    border: "1px solid #e0e0e0",
                    backgroundColor: "#fafafa"
                }}
            >
                <Typography 
                    variant="subtitle1" 
                    sx={{ 
                        fontWeight: "bold", 
                        mb: 3, 
                        color: "#333",
                        display: "flex",
                        alignItems: "center",
                        gap: 1
                    }}
                >
                    Filtrar Pedidos na Base
                </Typography>
                
                <Grid container spacing={3} alignItems="flex-end">
                    <Grid item xs={12} sm={5}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                            <People sx={{ color: "#1976d2", fontSize: 20 }} />
                            <Typography variant="body2" sx={{ fontWeight: "600", color: "#555" }}>
                                Cliente / Comprador
                            </Typography>
                        </Box>
                        <TextField
                            select
                            fullWidth
                            label="Selecione um comprador"
                            value={filtroCompradorId}
                            onChange={(e) => setFiltroCompradorId(e.target.value)}
                            sx={{ backgroundColor: "#fff" }}
                        >
                            <MenuItem value=""><em>Todos os Compradores</em></MenuItem>
                            {compradores.map((c) => (
                                <MenuItem key={c.id} value={c.id}>{c.nome}</MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    
                    <Grid item xs={12} sm={5}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                            <Restaurant sx={{ color: "#2e7d32", fontSize: 20 }} />
                            <Typography variant="body2" sx={{ fontWeight: "600", color: "#555" }}>
                                Produto / Corte de Carne
                            </Typography>
                        </Box>
                        <TextField
                            select
                            fullWidth
                            label="Selecione um produto"
                            value={filtroCarneId}
                            onChange={(e) => setFiltroCarneId(e.target.value)}
                            sx={{ backgroundColor: "#fff" }}
                        >
                            <MenuItem value=""><em>Todas as Carnes</em></MenuItem>
                            {carnes.map((m) => (
                                <MenuItem key={m.id} value={m.id}>{m.descricao}</MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    
                    <Grid item xs={12} sm={2}>
                        <Button
                            fullWidth
                            variant={(filtroCompradorId || filtroCarneId) ? "contained" : "outlined"}
                            color={(filtroCompradorId || filtroCarneId) ? "error" : "inherit"}
                            startIcon={<ClearAll />}
                            onClick={limparFiltrosBusca}
                            disabled={!filtroCompradorId && !filtroCarneId}
                            sx={{
                                height: "56px",
                                textTransform: "none",
                                fontWeight: "bold",
                                borderRadius: 1.5
                            }}
                        >
                            Limpar
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            <Grid container spacing={3}>
                {indicadores.map((card) => (
                    <Grid item xs={12} sm={6} md={3} key={card.id}>
                        <Card
                            onClick={() => setIdIndicadorSelecionado(card.id)}
                            sx={{
                                borderRadius: 3,
                                cursor: "pointer",
                                transition: "transform 0.2s, box-shadow 0.2s",
                                border: idIndicadorSelecionado === card.id ? `2px solid ${card.cor}` : "2px solid transparent",
                                boxShadow: idIndicadorSelecionado === card.id 
                                    ? "0 6px 20px rgba(0,0,0,0.15)" 
                                    : "0 4px 15px rgba(0,0,0,.1)",
                                "&:hover": {
                                    transform: "translateY(-4px)",
                                    boxShadow: "0 6px 20px rgba(0,0,0,0.15)"
                                }
                            }}
                        >
                            <CardContent>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                    <Box
                                        sx={{
                                            background: card.cor,
                                            color: "#fff",
                                            borderRadius: "50%",
                                            width: 50,
                                            height: 50,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center"
                                        }}
                                    >
                                        {card.icon}
                                    </Box>

                                    <Box>
                                        <Typography variant="h5" fontWeight="bold">
                                            {card.id === "pedidos" && (filtroCompradorId || filtroCarneId) 
                                                ? pedidosFiltrados.length 
                                                : card.valor
                                            }
                                        </Typography>
                                        <Typography color="text.secondary">
                                            {card.titulo}
                                        </Typography>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {idIndicadorSelecionado && (
                <Paper sx={{ mt: 4, p: 3, borderRadius: 3, boxShadow: "0 4px 15px rgba(0,0,0,.05)" }}>
                    
                    {idIndicadorSelecionado === "compradores" && (
                        <>
                            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2, color: "#1976d2" }}>
                                👥 Relação de Compradores
                            </Typography>
                            <Divider sx={{ mb: 1 }} />
                            <List>
                                {compradores.length === 0 ? (
                                    <Typography color="text.secondary">Nenhum comprador cadastrado.</Typography>
                                ) : (
                                    compradores.map((cliente) => (
                                        <ListItem key={cliente.id} disablePadding sx={{ py: 1 }}>
                                            <ListItemText 
                                                primary={cliente.nome} 
                                                secondary={`ID do cliente: #${cliente.id}`} 
                                            />
                                        </ListItem>
                                    ))
                                )}
                            </List>
                        </>
                    )}

                    {idIndicadorSelecionado === "carnes" && (
                        <>
                            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2, color: "#2e7d32" }}>
                                🥩 Carnes no Catálogo
                            </Typography>
                            <Divider sx={{ mb: 1 }} />
                            <List>
                                {carnes.length === 0 ? (
                                    <Typography color="text.secondary">Nenhuma carne cadastrada.</Typography>
                                ) : (
                                    carnes.map((item) => (
                                        <ListItem key={item.id} disablePadding sx={{ py: 1 }}>
                                            <ListItemText 
                                                primary={item.descricao} 
                                                secondary={`Origem: ${item.origem === 0 ? "Nacional" : "Importada"} | Código: ${item.id}`} 
                                            />
                                        </ListItem>
                                    ))
                                )}
                            </List>
                        </>
                    )}

                    {idIndicadorSelecionado === "pedidos" && (
                        <>
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                                <Typography variant="h6" sx={{ fontWeight: "bold", color: "#ed6c02" }}>
                                    🛒 Resumo dos Últimos Pedidos
                                </Typography>
                                {(filtroCompradorId || filtroCarneId) && (
                                    <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic" }}>
                                        Exibindo {pedidosFiltrados.length} de {pedidos.length} pedidos encontrados
                                    </Typography>
                                )}
                            </Box>
                            <Divider sx={{ mb: 1 }} />
                            <List>
                                {pedidosFiltrados.length === 0 ? (
                                    <Typography color="text.secondary">Nenhum pedido atende aos filtros de busca aplicados.</Typography>
                                ) : (
                                    pedidosFiltrados.map((pedido) => {
                                        const cliente = compradores.find(c => c.id === pedido.compradorId);
                                        return (
                                            <ListItem key={pedido.id} disablePadding sx={{ py: 1 }}>
                                                <ListItemText 
                                                    primary={`Pedido #${pedido.id} — Cliente: ${cliente?.nome ?? "Desconhecido"}`} 
                                                    secondary={`Quantidade de Itens: ${pedido.itens?.length ?? 0} | Valor Total: ${calcularTotalPedido(pedido.itens)}`} 
                                                />
                                            </ListItem>
                                        );
                                    })
                                )}
                            </List>
                        </>
                    )}

                    {idIndicadorSelecionado === "estoque" && (
                        <>
                            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2, color: "#9c27b0" }}>
                                📦 Monitoramento de Produtos (Estoque)
                            </Typography>
                            <Divider sx={{ mb: 1 }} />
                            <Typography variant="body1" sx={{ mt: 1 }} color="text.secondary">
                                O estoque possui atualmente um total de <strong>{carnes.length} variedades</strong> distintas de cortes catalogados para distribuição e movimentação comercial.
                            </Typography>
                        </>
                    )}

                </Paper>
            )}
        </Box>
    );
}

export default Home;