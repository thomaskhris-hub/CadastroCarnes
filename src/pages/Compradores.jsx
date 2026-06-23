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
    Typography,
    Paper,
    MenuItem
} from "@mui/material";

import {
    listarCompradores,
    criarComprador,
    atualizarComprador,
    excluirComprador
} from "../services/compradorService";
import { listarCidades } from "../services/cidadeService";
import { listarPedidos } from "../services/pedidoService";

function Compradores() {
    const [compradores, setCompradores] = useState([]);
    const [cidades, setCidades] = useState([]);
    const [pedidos, setPedidos] = useState([]);

    const [modalFormularioAberto, setModalFormularioAberto] = useState(false);
    const [modalExclusaoAberto, setModalExclusaoAberto] = useState(false);
    
    const [idCompradorEmEdicao, setIdCompradorEmEdicao] = useState(null);
    const [compradorSelecionado, setCompradorSelecionado] = useState(null);
    const [possuiPedidoVinculado, setPossuiPedidoVinculado] = useState(false);

  
    const [errosFormulario, setErrosFormulario] = useState({
        nome: false,
        documento: false,
        cidadeId: false
    });

    const [formulario, setFormulario] = useState({
        nome: "",
        documento: "",
        cidadeId: ""
    });

    async function carregarDadosCompradores() {
        try {
            const [listaCompradores, listaCidades, listaPedidos] = await Promise.all([
                listarCompradores(),
                listarCidades(),
                listarPedidos()
            ]);

            setCompradores(listaCompradores || []);
            setCidades(listaCidades || []);
            setPedidos(listaPedidos || []);
        } catch (error) {
            console.error("Erro ao carregar dados de compradores:", error);
        }
    }

    useEffect(() => {
        carregarDadosCompradores();
    }, []);

    function inicializarNovoComprador() {
        setIdCompradorEmEdicao(null);
        setFormulario({
            nome: "",
            documento: "",
            cidadeId: ""
        });
        setErrosFormulario({
            nome: false,
            documento: false,
            cidadeId: false
        });
        setModalFormularioAberto(true);
    }

    function prepararEdicaoComprador(comprador) {
        setIdCompradorEmEdicao(comprador.id);
        setFormulario({
            nome: comprador.nome || "",
            documento: comprador.documento || "",
            cidadeId: comprador.cidadeId || ""
        });
        setErrosFormulario({
            nome: false,
            documento: false,
            cidadeId: false
        });
        setModalFormularioAberto(true);
    }

    async function salvarComprador() {
     
        const novosErros = {
            nome: !formulario.nome.trim(),
            documento: !formulario.documento.trim(),
            cidadeId: !formulario.cidadeId
        };

        setErrosFormulario(novosErros);

        // Se houver qualquer campo inválido, interrompe o salvamento
        if (novosErros.nome || novosErros.documento || novosErros.cidadeId) {
            return;
        }

        try {
            if (idCompradorEmEdicao) {
                await atualizarComprador(idCompradorEmEdicao, formulario);
            } else {
                await criarComprador(formulario);
            }
            setModalFormularioAberto(false);
            carregarDadosCompradores();
        } catch (error) {
            console.error("Erro ao salvar comprador:", error);
        }
    }

    function validarExclusaoComprador(comprador) {
        const temPedido = pedidos.some(pedido => Number(pedido.compradorId) === Number(comprador.id));
        setCompradorSelecionado(comprador);
        setPossuiPedidoVinculado(temPedido);
        setModalExclusaoAberto(true);
    }

    async function executarRemocaoComprador() {
        if (!compradorSelecionado) return;
        
        try {
            await excluirComprador(compradorSelecionado.id);
            setModalExclusaoAberto(false);
            setCompradorSelecionado(null);
            carregarDadosCompradores();
        } catch (error) {
            console.error("Erro ao excluir comprador:", error);
        }
    }

    const columns = useMemo(() => [
        {
            accessorKey: "id",
            header: "Código"
        },
        {
            accessorKey: "nome",
            header: "Nome"
        },
        {
            accessorKey: "documento",
            header: "Documento"
        },
        {
            id: "cidade",
            header: "Cidade",
            accessorFn: (row) => row.cidade?.nome ?? ""
        }
    ], []);

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: "bold", color: "#006633" }}>
                        👥 Cadastro de Compradores
                    </Typography>
                    <Typography color="text.secondary">
                        Gerenciamento dos compradores cadastrados
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    onClick={inicializarNovoComprador}
                    sx={{
                        background: "#006633",
                        "&:hover": { background: "#004d26" }
                    }}
                >
                    Novo Comprador
                </Button>
            </Box>

            <Paper sx={{ borderRadius: 3, overflow: "hidden", boxShadow: "0 4px 15px rgba(0,0,0,.08)" }}>
                <MaterialReactTable
                    columns={columns}
                    data={compradores}
                    enableRowActions
                    renderRowActions={({ row }) => (
                        <Box>
                            <Button size="small" onClick={() => prepararEdicaoComprador(row.original)}>
                                Editar
                            </Button>
                            <Button size="small" color="error" onClick={() => validarExclusaoComprador(row.original)}>
                                Excluir
                            </Button>
                        </Box>
                    )}
                />
            </Paper>

            <Dialog open={modalFormularioAberto} onClose={() => setModalFormularioAberto(false)} fullWidth>
                <DialogTitle>
                    {idCompradorEmEdicao ? "Editar Comprador" : "Novo Comprador"}
                </DialogTitle>
                <DialogContent>
                    <TextField
                        required
                        fullWidth
                        margin="normal"
                        label="Nome"
                        value={formulario.nome}
                        error={errosFormulario.nome}
                        helperText={errosFormulario.nome ? "O campo Nome é obrigatório." : ""}
                        onChange={(e) => {
                            setFormulario({ ...formulario, nome: e.target.value });
                            if (errosFormulario.nome) setErrosFormulario({ ...errosFormulario, nome: false });
                        }}
                    />
                    <TextField
                        required
                        fullWidth
                        margin="normal"
                        label="Documento"
                        value={formulario.documento}
                        error={errosFormulario.documento}
                        helperText={errosFormulario.documento ? "O campo Documento é obrigatório." : ""}
                        onChange={(e) => {
                            setFormulario({ ...formulario, documento: e.target.value });
                            if (errosFormulario.documento) setErrosFormulario({ ...errosFormulario, documento: false });
                        }}
                    />
                    <TextField
                        select
                        required
                        fullWidth
                        margin="normal"
                        label="Cidade"
                        value={formulario.cidadeId}
                        error={errosFormulario.cidadeId}
                        helperText={errosFormulario.cidadeId ? "Selecione uma Cidade." : ""}
                        onChange={(e) => {
                            setFormulario({ ...formulario, cidadeId: Number(e.target.value) });
                            if (errosFormulario.cidadeId) setErrosFormulario({ ...errosFormulario, cidadeId: false });
                        }}
                    >
                        {cidades.map(c => (
                            <MenuItem key={c.id} value={c.id}>
                                {c.nome}
                            </MenuItem>
                        ))}
                    </TextField>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setModalFormularioAberto(false)}>Cancelar</Button>
                    <Button variant="contained" onClick={salvarComprador} sx={{ background: "#006633" }}>
                        Salvar
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={modalExclusaoAberto} onClose={() => setModalExclusaoAberto(false)}>
                <DialogTitle sx={{ fontWeight: "bold" }}>
                    {possuiPedidoVinculado ? "Não é possível excluir" : "Confirmar Exclusão"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {possuiPedidoVinculado 
                            ? `O comprador "${compradorSelecionado?.nome}" possui pedidos vinculados ao seu cadastro e não pode ser excluído.`
                            : `Deseja realmente excluir o comprador "${compradorSelecionado?.nome}"?`
                        }
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ pb: 2, px: 3 }}>
                    {possuiPedidoVinculado ? (
                        <Button onClick={() => setModalExclusaoAberto(false)} variant="contained" sx={{ background: "#006633" }}>
                            Entendido
                        </Button>
                    ) : (
                        <>
                            <Button onClick={() => setModalExclusaoAberto(false)}>Cancelar</Button>
                            <Button onClick={executarRemocaoComprador} color="error" variant="contained">
                                Excluir
                            </Button>
                        </>
                    )}
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default Compradores;