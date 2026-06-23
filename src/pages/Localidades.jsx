import { useEffect, useState } from "react";
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
    IconButton,
    Divider
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import {
    listarEstados,
    criarEstado,
    atualizarEstado,
    excluirEstado
} from "../services/estadoService";

import {
    criarCidade,
    atualizarCidade,
    excluirCidade
} from "../services/cidadeService";

import { listarCompradores } from "../services/compradorService";

function Localidades() {
    const [estados, setEstados] = useState([]);
    const [compradores, setCompradores] = useState([]);

    const [modalEstadoAberto, setModalEstadoAberto] = useState(false);
    const [modalCidadeAberto, setModalCidadeAberto] = useState(false);
    const [modalNotificacaoAberto, setModalNotificacaoAberto] = useState(false);

    const [idEstadoEmEdicao, setIdEstadoEmEdicao] = useState(null);
    const [idCidadeEmEdicao, setIdCidadeEmEdicao] = useState(null);
    const [estadoSelecionado, setEstadoSelecionado] = useState(null);
    const [itemVinculadoFluxo, setItemVinculadoFluxo] = useState(null);
    const [fluxoNotificacao, setFluxoNotificacao] = useState(""); 

    const [formularioEstado, setFormularioEstado] = useState({
        nome: "",
        uf: ""
    });

    const [formularioCidade, setFormularioCidade] = useState({
        nome: ""
    });

    async function carregarDadosLocalidades() {
        try {
            const [dadosEstados, dadosCompradores] = await Promise.all([
                listarEstados(),
                listarCompradores()
            ]);
            setEstados(dadosEstados || []);
            setCompradores(dadosCompradores || []);
        } catch (error) {
            console.error("Erro ao carregar dados de localidades:", error);
        }
    }

    useEffect(() => {
        carregarDadosLocalidades();
    }, []);

    function inicializarNovoEstado() {
        setIdEstadoEmEdicao(null);
        setFormularioEstado({ nome: "", uf: "" });
        setModalEstadoAberto(true);
    }

    function validarEdicaoEstado(estado) {
        const idsCidadesEstado = estado.cidades?.map(c => c.id) || [];
        const possuiCompradorVinculado = compradores.some(comp => idsCidadesEstado.includes(comp.cidadeId));

        if (possuiCompradorVinculado) {
            setItemVinculadoFluxo(estado);
            setFluxoNotificacao("bloqueioEstado");
            setModalNotificacaoAberto(true);
        } else {
            setIdEstadoEmEdicao(estado.id);
            setFormularioEstado({
                nome: estado.nome,
                uf: estado.uf
            });
            setModalEstadoAberto(true);
        }
    }

    async function salvarEstado() {
        try {
            if (idEstadoEmEdicao) {
                await atualizarEstado(idEstadoEmEdicao, formularioEstado);
            } else {
                await criarEstado(formularioEstado);
            }
            setModalEstadoAberto(false);
            carregarDadosLocalidades();
        } catch (error) {
            console.error("Erro ao salvar estado:", error);
        }
    }

    function validarExclusaoEstado(estado) {
        const idsCidadesEstado = estado.cidades?.map(c => c.id) || [];
        const possuiCompradorVinculado = compradores.some(comp => idsCidadesEstado.includes(comp.cidadeId));

        setItemVinculadoFluxo(estado);
        setFluxoNotificacao(possuiCompradorVinculado ? "bloqueioEstado" : "exclusaoEstado");
        setModalNotificacaoAberto(true);
    }

    function inicializarNovaCidade(estado) {
        setEstadoSelecionado(estado);
        setIdCidadeEmEdicao(null);
        setFormularioCidade({ nome: "" });
        setModalCidadeAberto(true);
    }

    function validarEdicaoCidade(cidade, estado) {
        setEstadoSelecionado(estado);
        const possuiCompradorVinculado = compradores.some(comp => Number(comp.cidadeId) === Number(cidade.id));

        if (possuiCompradorVinculado) {
            setItemVinculadoFluxo(cidade);
            setFluxoNotificacao("bloqueioCidade");
            setModalNotificacaoAberto(true);
        } else {
            setIdCidadeEmEdicao(cidade.id);
            setFormularioCidade({ nome: cidade.nome });
            setModalCidadeAberto(true);
        }
    }

    async function salvarCidade() {
        try {
            const payloadCidade = {
                nome: formularioCidade.nome,
                estadoId: estadoSelecionado.id
            };

            if (idCidadeEmEdicao) {
                await atualizarCidade(idCidadeEmEdicao, payloadCidade);
            } else {
                await criarCidade(payloadCidade);
            }
            setModalCidadeAberto(false);
            carregarDadosLocalidades();
        } catch (error) {
            console.error("Erro ao salvar cidade:", error);
        }
    }

    function validarExclusaoCidade(cidade) {
        const possuiCompradorVinculado = compradores.some(comp => Number(comp.cidadeId) === Number(cidade.id));
        
        setItemVinculadoFluxo(cidade);
        setFluxoNotificacao(possuiCompradorVinculado ? "bloqueioCidade" : "exclusaoCidade");
        setModalNotificacaoAberto(true);
    }

    async function confirmarAcaoNotificacao() {
        if (!itemVinculadoFluxo) return;

        try {
            if (fluxoNotificacao === "exclusaoEstado") {
                await excluirEstado(itemVinculadoFluxo.id);
            } else if (fluxoNotificacao === "exclusaoCidade") {
                await excluirCidade(itemVinculadoFluxo.id);
            }
            setModalNotificacaoAberto(false);
            setItemVinculadoFluxo(null);
            carregarDadosLocalidades();
        } catch (error) {
            console.error("Erro ao executar ação de exclusão:", error);
        }
    }

    return (
        <Box sx={{ p: 4 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: "bold", color: "#006633" }}>
                    📍 Cadastro de Localidades
                </Typography>
                <Button variant="contained" onClick={inicializarNovoEstado} sx={{ background: "#006633" }}>
                    Novo Estado
                </Button>
            </Box>

            {estados.map(estado => (
                <Paper key={estado.id} sx={{ p: 3, mb: 3, borderRadius: 3 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Box>
                            <Typography variant="h5" fontWeight="bold">
                                {estado.nome} - {estado.uf}
                            </Typography>
                        </Box>
                        <Box>
                            <IconButton onClick={() => validarEdicaoEstado(estado)}>
                                <EditIcon />
                            </IconButton>
                            <IconButton color="error" onClick={() => validarExclusaoEstado(estado)}>
                                <DeleteIcon />
                            </IconButton>
                        </Box>
                    </Box>

                    <Divider sx={{ my: 2 }} />
                    <Typography fontWeight="bold">Cidades</Typography>

                    {estado.cidades?.map(cidade => (
                        <Box key={cidade.id} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 1 }}>
                            <Typography>{cidade.nome}</Typography>
                            <Box>
                                <Button size="small" onClick={() => validarEdicaoCidade(cidade, estado)}>
                                    Editar
                                </Button>
                                <Button size="small" color="error" onClick={() => validarExclusaoCidade(cidade)}>
                                    Excluir
                                </Button>
                            </Box>
                        </Box>
                    ))}

                    <Button sx={{ mt: 2 }} variant="outlined" onClick={() => inicializarNovaCidade(estado)}>
                        + Nova Cidade
                    </Button>
                </Paper>
            ))}

            <Dialog open={modalEstadoAberto} onClose={() => setModalEstadoAberto(false)}>
                <DialogTitle>{idEstadoEmEdicao ? "Editar Estado" : "Novo Estado"}</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Nome"
                        value={formularioEstado.nome}
                        onChange={(e) => setFormularioEstado({ ...formularioEstado, nome: e.target.value })}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="UF"
                        value={formularioEstado.uf}
                        onChange={(e) => setFormularioEstado({ ...formularioEstado, uf: e.target.value })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setModalEstadoAberto(false)}>Cancelar</Button>
                    <Button variant="contained" onClick={salvarEstado} sx={{ background: "#006633" }}>
                        Salvar
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={modalCidadeAberto} onClose={() => setModalCidadeAberto(false)}>
                <DialogTitle>{idCidadeEmEdicao ? "Editar Cidade" : "Nova Cidade"}</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Cidade"
                        value={formularioCidade.nome}
                        onChange={(e) => setFormularioCidade({ nome: e.target.value })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setModalCidadeAberto(false)}>Cancelar</Button>
                    <Button variant="contained" onClick={salvarCidade} sx={{ background: "#006633" }}>
                        Salvar
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={modalNotificacaoAberto} onClose={() => setModalNotificacaoAberto(false)}>
                <DialogTitle sx={{ fontWeight: "bold" }}>
                    {fluxoNotificacao.startsWith("bloqueio") ? "Ação Bloqueada" : "Confirmar Exclusão"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {fluxoNotificacao === "bloqueioEstado" && `O estado "${itemVinculadoFluxo?.nome}" possui cidades vinculadas a compradores ativos e não pode ser alterado ou excluído.`}
                        {fluxoNotificacao === "bloqueioCidade" && `A cidade "${itemVinculadoFluxo?.nome}" está vinculada a um ou mais compradores cadastrados e não pode ser alterada ou excluída.`}
                        {fluxoNotificacao === "exclusaoEstado" && `Deseja realmente excluir o estado "${itemVinculadoFluxo?.nome}" de forma definitiva?`}
                        {fluxoNotificacao === "exclusaoCidade" && `Deseja realmente excluir a cidade "${itemVinculadoFluxo?.nome}" de forma definitiva?`}
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ pb: 2, px: 3 }}>
                    {fluxoNotificacao.startsWith("bloqueio") ? (
                        <Button onClick={() => setModalNotificacaoAberto(false)} variant="contained" sx={{ background: "#006633" }}>
                            Entendido
                        </Button>
                    ) : (
                        <>
                            <Button onClick={() => setModalNotificacaoAberto(false)}>Cancelar</Button>
                            <Button onClick={confirmarAcaoNotificacao} color="error" variant="contained">
                                Excluir
                            </Button>
                        </>
                    )}
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default Localidades;