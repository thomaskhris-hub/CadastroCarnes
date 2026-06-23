import { useEffect, useMemo, useState } from "react";
import { MaterialReactTable } from "material-react-table";
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

import {
    listarCarnes,
    criarCarne,
    atualizarCarne,
    excluirCarne
} from "../services/carneService";
import { listarPedidos } from "../services/pedidoService";

function Carnes() {
    const [carnes, setCarnes] = useState([]);
    const [pedidos, setPedidos] = useState([]);

    const [modalCadastroAberto, setModalCadastroAberto] = useState(false);
    const [modalExclusaoAberto, setModalExclusaoAberto] = useState(false);
    const [modalBloqueioEdicaoAberto, setModalBloqueioEdicaoAberto] = useState(false);

    const [idCarneEmEdicao, setIdCarneEmEdicao] = useState(null);
    const [carneSelecionada, setCarneSelecionada] = useState(null);
    const [possuiPedidoVinculado, setPossuiPedidoVinculado] = useState(false);

    const [formulario, setFormulario] = useState({
        descricao: "",
        origem: 0
    });

    async function carregarDadosCarnes() {
        try {
            const [dadosCarnes, listaPedidos] = await Promise.all([
                listarCarnes(),
                listarPedidos()
            ]);
            setCarnes(dadosCarnes || []);
            setPedidos(listaPedidos || []);
        } catch (error) {
            console.error("Erro ao carregar dados de carnes:", error);
        }
    }

    useEffect(() => {
        carregarDadosCarnes();
    }, []);

    function inicializarNovaCarne() {
        setIdCarneEmEdicao(null);
        setFormulario({
            descricao: "",
            origem: 0
        });
        setModalCadastroAberto(true);
    }

    function validarEdicaoCarne(carne) {
        const temPedido = pedidos.some(pedido => 
            pedido.itens?.some(item => Number(item.carneId) === Number(carne.id))
        );

        if (temPedido) {
            setCarneSelecionada(carne);
            setModalBloqueioEdicaoAberto(true); 
        } else {
            setIdCarneEmEdicao(carne.id);
            setFormulario({
                descricao: carne.descricao || "",
                origem: carne.origem ?? 0
            });
            setModalCadastroAberto(true);
        }
    }

    async function salvarCarne() {
        try {
            if (idCarneEmEdicao) {
                await atualizarCarne(idCarneEmEdicao, formulario);
            } else {
                await criarCarne(formulario);
            }
            setModalCadastroAberto(false);
            carregarDadosCarnes();
        } catch (error) {
            console.error("Erro ao salvar carne:", error);
        }
    }

    function validarExclusaoCarne(carne) {
        const temPedido = pedidos.some(pedido => 
            pedido.itens?.some(item => Number(item.carneId) === Number(carne.id))
        );

        setCarneSelecionada(carne);
        setPossuiPedidoVinculado(temPedido);
        setModalExclusaoAberto(true);
    }

    async function executarRemocaoCarne() {
        if (!carneSelecionada) return;

        try {
            await excluirCarne(carneSelecionada.id);
            setModalExclusaoAberto(false);
            setCarneSelecionada(null);
            carregarDadosCarnes();
        } catch (error) {
            console.error("Erro ao remover carne:", error);
        }
    }

    const columns = useMemo(() => [
        {
            accessorKey: "id",
            header: "Código"
        },
        {
            accessorKey: "descricao",
            header: "Descrição"
        },
        {
            accessorKey: "origem",
            header: "Origem",
            Cell: ({ cell }) => cell.getValue() === 0 ? "Nacional" : "Importada"
        }
    ], []);

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: "bold", color: "#006633" }}>
                        🥩 Cadastro de Carnes
                    </Typography>
                    <Typography color="text.secondary">
                        Gerenciamento dos produtos cadastrados
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    onClick={inicializarNovaCarne}
                    sx={{
                        background: "#006633",
                        "&:hover": { background: "#004d26" }
                    }}
                >
                    Nova Carne
                </Button>
            </Box>

            <Paper sx={{ borderRadius: 3, overflow: "hidden", boxShadow: "0 4px 15px rgba(0,0,0,.08)" }}>
                <MaterialReactTable
                    columns={columns}
                    data={carnes}
                    enableRowActions
                    renderRowActions={({ row }) => (
                        <Box>
                            <Button size="small" onClick={() => validarEdicaoCarne(row.original)}>
                                Editar
                            </Button>
                            <Button size="small" color="error" onClick={() => validarExclusaoCarne(row.original)}>
                                Excluir
                            </Button>
                        </Box>
                    )}
                />
            </Paper>

            <Dialog open={modalCadastroAberto} onClose={() => setModalCadastroAberto(false)}>
                <DialogTitle>
                    {idCarneEmEdicao ? "Editar Carne" : "Nova Carne"}
                </DialogTitle>
                <DialogContent>
                    <TextField
                        label="Descrição"
                        fullWidth
                        margin="normal"
                        value={formulario.descricao}
                        onChange={(e) => setFormulario({ ...formulario, descricao: e.target.value })}
                    />
                    <TextField
                        select
                        label="Origem"
                        fullWidth
                        value={formulario.origem}
                        onChange={(e) => setFormulario({ ...formulario, origem: Number(e.target.value) })}
                    >
                        <MenuItem value={0}>Nacional</MenuItem>
                        <MenuItem value={1}>Importada</MenuItem>
                    </TextField>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setModalCadastroAberto(false)}>Cancelar</Button>
                    <Button variant="contained" onClick={salvarCarne} sx={{ background: "#006633" }}>
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
                            ? `A carne "${carneSelecionada?.descricao}" já foi adicionada em pedidos do sistema e não pode ser excluída.`
                            : `Deseja realmente excluir a carne "${carneSelecionada?.descricao}"?`
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
                            <Button onClick={executarRemocaoCarne} color="error" variant="contained">
                                Excluir
                            </Button>
                        </>
                    )}
                </DialogActions>
            </Dialog>

<Dialog open={modalBloqueioEdicaoAberto} onClose={() => setModalBloqueioEdicaoAberto(false)}>
    <DialogTitle sx={{ fontWeight: "bold" }}>
        Não é possível editar
    </DialogTitle>
    <DialogContent>
        <DialogContentText>
            
            {`A carne "${carneSelecionada?.descricao}" já possui movimentações em pedidos existentes. Para não alterar o histórico das vendas, a edição está bloqueada.`}
        </DialogContentText>
    </DialogContent>
    <DialogActions sx={{ pb: 2, px: 3 }}>
        <Button onClick={() => setModalBloqueioEdicaoAberto(false)} variant="contained" sx={{ background: "#006633" }}>
            Entendido
        </Button>
    </DialogActions>
</Dialog>
        </Box>
    );
}

export default Carnes;