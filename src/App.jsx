import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import Layout from "./layout/Layout";

import Carnes from "./pages/Carnes";
import Compradores from "./pages/Compradores";
import Pedidos from "./pages/Pedidos";
import Localidade from "./pages/Localidades";
import Home from "./pages/Home"

function App() {

    return (
        <BrowserRouter>

            <Routes>

                <Route element={<Layout />}>

                  
                    <Route
                        path="/"
                        element={<Navigate to="/Home" />}
                         element={<Home />}
                    />

                    <Route
                        path="/carnes"
                        element={<Carnes />}
                    />

                    <Route
                        path="/compradores"
                        element={<Compradores />}
                    />

                    <Route
                        path="/pedidos"
                        element={<Pedidos />}
                    />

                     <Route
                        path="/localidades"
                        element={<Localidade />}
                    />

                </Route>

            </Routes>

        </BrowserRouter>
    );
}

export default App;