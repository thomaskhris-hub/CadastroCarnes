import { useEffect, useMemo, useState } from "react";
import { MaterialReactTable } from "material-react-table";
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
    Typography,
    Paper,
    Divider,
    Alert
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { NumericFormat } from "react-number-format";

import { listarPedidos, criarPedido, excluirPedido } from "../services/pedidoService";
import { listarCompradores } from "../services/compradorService";
import { listarCarnes } from "../services/carneService";
import { buscarCotacao } from "../services/moedaService"; 

const OPCOES_MOEDAS = [
    { value: "BRL", label: "Real (BRL)", prefix: "R$ " },
    { value: "USD", label: "Dólar (USD)", prefix: "$ " },
    { value: "EUR", label: "Euro (EUR)", prefix: "€ " }
];

function Pedidos() {
    const [pedidos, setPedidos] = useState([]);
    const [compradores, setCompradores] = useState([]);
    const [carnes, setCarnes] = useState([]);
    
  
    const [cotacaoMoedas, setCotacaoMoedas] = useState({ USD: 0, EUR: 0 });
    const [sistemaMoedasDisponivel, setSistemaMoedasDisponivel] = useState(true);

    const [modalCadastroAberto, setModalCadastroAberto] = useState(false);
    const [modalExclusaoAberto, setModalExclusaoAberto] = useState(false);
    const [pedidoIdParaExcluir, setPedidoIdParaExcluir] = useState(null);
    const [formularioSubmetido, setFormularioSubmetido] = useState(false);

    const [formulario, setFormulario] = useState({
        compradorId: "",
        itens: [{ carneId: "", preco: "", moeda: "BRL" }]
    });

    async function inicializarDadosSistema() {
        try {
            const [dadosPedidos, dadosCompradores, dadosCarnes] = await Promise.all([
                listarPedidos(),
                listarCompradores(),
                listarCarnes()
            ]);

            setCompradores(dadosCompradores || []);
            setCarnes(dadosCarnes || []);

         
            const [respostaUsd, respostaEur] = await Promise.all([
                buscarCotacao("USD"),
                buscarCotacao("EUR")
            ]);

       
            if (!respostaUsd?.valor || !respostaEur?.valor) {
                setSistemaMoedasDisponivel(false);
            } else {
                setSistemaMoedasDisponivel(true);
                setCotacaoMoedas({
                    USD: respostaUsd.valor,
                    EUR: respostaEur.valor
                });
            }

            const listaPedidosTratados = (dadosPedidos || []).map(pedido => {
                const idComp = pedido.compradorId ?? pedido.compradorid ?? pedido.comprador_id;
                const compradorEncontrado = (dadosCompradores || []).find(c => c && String(c.id) === String(idComp));

                const subItens = pedido.itens ?? pedido.pedidoItens ?? pedido.Itens ?? [];
                const subItensTratados = subItens.map(item => {
                    const idCarne = item.carneId ?? item.carneid ?? item.carne_id;
                    const carneEncontrada = (dadosCarnes || []).find(carne => carne && String(carne.id) === String(idCarne));
                    return {
                        ...item,
                        carneDescricaoExibicao: carneEncontrada ? carneEncontrada.descricao : `ID #${idCarne}`
                    };
                });

                return {
                    ...pedido,
                    compradorNomeExibicao: compradorEncontrado ? compradorEncontrado.nome : `ID #${idComp}`,
                    itensTratados: subItensTratados
                };
            });

            setPedidos(listaPedidosTratados);
        } catch (error) {
            console.error("Erro ao carregar dados do sistema:", error);
            setSistemaMoedasDisponivel(false);
        }
    }

    useEffect(() => {
        inicializarDadosSistema();
    }, []);

    const subtotalFormulario = useMemo(() => {
        if (!sistemaMoedasDisponivel) return "Indisponível (Sem Cotação)";

        const total = formulario.itens.reduce((soma, item) => {
            const preco = Number(item?.preco || 0);
            let cotacao = 10000; // BRL padrão
            
            if (item?.moeda === "USD") cotacao = cotacaoMoedas.USD;
            if (item?.moeda === "EUR") cotacao = cotacaoMoedas.EUR;

          
            if (cotacao === 0) return soma;

            return soma + (preco * (cotacao / 10000));
        }, 0);

        return total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    }, [formulario.itens, cotacaoMoedas, sistemaMoedasDisponivel]);

    const validacaoCamposInvalida = useMemo(() => {
        if (!formulario.compradorId) return true;
        if (formulario.itens.length === 0) return true;
        return formulario.itens.some(item => !item.carneId || !item.moeda || Number(item.preco || 0) <= 0);
    }, [formulario]);

    function abrirNovoPedido() {
        setFormularioSubmetido(false);
        setFormulario({
            compradorId: "",
            itens: [{ carneId: "", preco: "", moeda: "BRL" }]
        });
        setModalCadastroAberto(true);
    }

    function adicionarItemCarne() {
        setFormulario({
            ...formulario,
            itens: [...formulario.itens, {carneId: "", preco: "", moeda: "BRL"}]
        });
    }

    function removerItemCarne(index) {
        const lista = [...formulario.itens];
        lista.splice(index, 1);
        setFormulario({ ...formulario, itens: lista });
    }

    function atualizarCampoItem(index, campo, valor) {
        const lista = [...formulario.itens];
        if (lista[index]) {
            lista[index][campo] = valor;
            setFormulario({ ...formulario, itens: lista });
        }
    }

    async function salvarPedido() {
        setFormularioSubmetido(true);

        if (validacaoCamposInvalida || !sistemaMoedasDisponivel) {
            return;
        }

        try {
            const itensPromessas = formulario.itens.map(async (item) => {
                let valorMoedaFinal = 10000;
                if (item.moeda !== "BRL") {
                    const respostaCotacao = await buscarCotacao(item.moeda);
                    valorMoedaFinal = respostaCotacao?.valor || 0; 
                }
                return {
                    carneId: Number(item.carneId),
                    preco: Number(item.preco),
                    moeda: valorMoedaFinal 
                };
            });

            const itensFormatados = await Promise.all(itensPromessas);
            
           
            const possuiMoedaInvalida = itensFormatados.some(i => i.moeda === 0);
            if (possuiMoedaInvalida) {
                alert("Erro: Não foi possível obter as taxas de câmbio necessárias.");
                return;
            }

            await criarPedido({
                compradorId: Number(formulario.compradorId),
                itens: itensFormatados
            });
            setModalCadastroAberto(false);
            inicializarDadosSistema();
        } catch (error) {
            alert("Erro ao salvar o pedido.");
        }
    }

    function iniciarExclusaoPedido(id) {
        setPedidoIdParaExcluir(id);
        setModalExclusaoAberto(true);
    }

    async function confirmarExclusaoPedido() {
        if (pedidoIdParaExcluir) {
            await excluirPedido(pedidoIdParaExcluir);
            setModalExclusaoAberto(false);
            setPedidoIdParaExcluir(null);
            inicializarDadosSistema();
        }
    }

    const columns = useMemo(() => [
        { accessorKey: "id", header: "Pedido" },
        { accessorKey: "compradorNomeExibicao", header: "Comprador" },
        {
            id: "carnesListadas",
            header: "Carnes",
            accessorFn: (row) => {
                const lista = row?.itensTratados || [];
                return lista.length === 0 ? "Nenhuma carne" : lista.map(i => i.carneDescricaoExibicao).join(", ");
            }
        },
        {
            id: "valor",
            header: "Valor Total (Convertido)",
            accessorFn: (row) => {
                const lista = row?.itensTratados || [];
                const total = lista.reduce((soma, item) => {
                    const preco = Number(item.preco || 0);
                    const cotacao = Number(item.moeda || 10000);
                    return soma + (preco * (cotacao / 10000));
                }, 0) || 0;
                return total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
            }
        }
    ], []);

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: "bold", color: "#006633" }}>🛒 Pedidos</Typography>
                    <Typography color="text.secondary">Gerenciamento de pedidos de carnes</Typography>
                </Box>
                <Button 
                    variant="contained" 
                    onClick={abrirNovoPedido} 
                    disabled={!sistemaMoedasDisponivel}
                    sx={{ background: "#006633", "&:hover": { background: "#004d26" } }}
                >
                    Novo Pedido
                </Button>
            </Box>

            {!sistemaMoedasDisponivel && (
                <Alert severity="error" sx={{ mb: 3, fontWeight: "bold" }}>
                    O serviço de cotações de moedas está indisponível. A criação de pedidos está temporariamente suspensa.
                </Alert>
            )}

            <Paper sx={{ borderRadius: 3, overflow: "hidden", boxShadow: "0 4px 15px rgba(0,0,0,.08)" }}>
                <MaterialReactTable
                    columns={columns}
                    data={pedidos}
                    enableRowActions
                    renderRowActions={({ row }) => (
                        <Button color="error" size="small" onClick={() => iniciarExclusaoPedido(row?.original?.id)}>
                            Excluir
                        </Button>
                    )}
                />
            </Paper>

            <Dialog open={modalCadastroAberto} onClose={() => setModalCadastroAberto(false)} fullWidth maxWidth="md">
                <DialogTitle sx={{ fontWeight: "bold" }}>Novo Pedido</DialogTitle>
                <DialogContent>
                    
                    <TextField
                        select
                        fullWidth
                        required
                        margin="normal"
                        label="Comprador *"
                        value={formulario.compradorId}
                        onChange={(e) => setFormulario({ ...formulario, compradorId: e.target.value })}
                        error={formularioSubmetido && !formulario.compradorId}
                        helperText={formularioSubmetido && !formulario.compradorId ? "O campo Comprador é obrigatório." : ""}
                    >
                        {compradores.map(c => (
                            <MenuItem key={c.id} value={c.id}>{c.nome}</MenuItem>
                        ))}
                    </TextField>

                    <Typography variant="h6" sx={{ mt: 3, fontWeight: "bold" }}>Carnes</Typography>

                    {formulario.itens.map((item, index) => {
                        const configMoeda = OPCOES_MOEDAS.find(m => m.value === item.moeda) || { prefix: "R$ " };
                        const precoInvalido = Number(item?.preco || 0) <= 0;

                        return (
                            <Box key={index} sx={{ mt: 2, display: "flex", gap: 2, alignItems: "flex-start" }}>
                                <TextField
                                    select
                                    required
                                    label="Carne *"
                                    fullWidth
                                    value={item.carneId}
                                    onChange={(e) => atualizarCampoItem(index, "carneId", e.target.value)}
                                    error={formularioSubmetido && !item.carneId}
                                    helperText={formularioSubmetido && !item.carneId ? "Selecione uma carne." : ""}
                                >
                                    {carnes.map(c => (
                                        <MenuItem key={c.id} value={c.id}>{c.descricao}</MenuItem>
                                    ))}
                                </TextField>

                                <TextField
                                    select
                                    required
                                    label="Moeda *"
                                    sx={{ width: "220px" }}
                                    value={item.moeda}
                                    onChange={(e) => atualizarCampoItem(index, "moeda", e.target.value)}
                                    error={formularioSubmetido && !item.moeda}
                                    helperText={formularioSubmetido && !item.moeda ? "Selecione a moeda." : ""}
                                >
                                    {OPCOES_MOEDAS.map(m => (
                                        <MenuItem key={m.value} value={m.value}>{m.label}</MenuItem>
                                    ))}
                                </TextField>

                                <NumericFormat
                                    customInput={TextField}
                                    required
                                    label="Preço *"
                                    prefix={configMoeda.prefix}
                                    thousandSeparator={item.moeda === "BRL" ? "." : ","}
                                    decimalSeparator={item.moeda === "BRL" ? "," : "."}
                                    decimalScale={2}
                                    fixedDecimalScale
                                    value={item.preco}
                                    onValueChange={(values) => atualizarCampoItem(index, "preco", values.value)}
                                    error={formularioSubmetido && precoInvalido}
                                    helperText={formularioSubmetido && precoInvalido ? "Preço obrigatório e maior que zero." : ""}
                                />

                                <IconButton 
                                    color="error" 
                                    onClick={() => removerItemCarne(index)} 
                                    disabled={formulario.itens.length === 1}
                                    sx={{ mt: 1 }}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </Box>
                        );
                    })}

                    <Button sx={{ mt: 2 }} variant="outlined" onClick={adicionarItemCarne}>
                        + Adicionar Carne
                    </Button>

                    <Box sx={{ mt: 4, mb: 1 }}>
                        <Divider />
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 2, px: 1 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: "500", color: "text.secondary" }}>Total Acumulado:</Typography>
                            <Typography variant="h5" sx={{ fontWeight: "bold", color: "#006633" }}>{subtotalFormulario}</Typography>
                        </Box>
                    </Box>

                </DialogContent>

                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setModalCadastroAberto(false)}>Cancelar</Button>
                    <Button 
                        variant="contained" 
                        onClick={salvarPedido} 
                        sx={{ background: "#006633", px: 3, "&:hover": { background: "#004d26" } }}
                    >
                        Salvar Pedido
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={modalExclusaoAberto} onClose={() => setModalExclusaoAberto(false)}>
                <DialogTitle sx={{ fontWeight: "bold" }}>Confirmar Exclusão</DialogTitle>
                <DialogContent>
                    <DialogContentText>Deseja excluir este pedido?</DialogContentText>
                </DialogContent>
                <DialogActions sx={{ pb: 2, px: 3 }}>
                    <Button onClick={() => setModalExclusaoAberto(false)}>Cancelar</Button>
                    <Button onClick={confirmarExclusaoPedido} color="error" variant="contained">Excluir</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default Pedidos;