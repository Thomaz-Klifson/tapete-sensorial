/* eslint-disable prettier/prettier */
import './assets/main.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Table from './pages/select/Table';
import Ide from './pages/ide';
import Intro from './pages/intro';
import Game from './pages/game';
/**
 * Componente App
 *
 * Este componente principal da aplicação serve como um container para a navegação entre as diferentes páginas usando o React Router.
 * Ele configura as rotas da aplicação, determinando quais componentes devem ser renderizados com base na URL acessada pelo usuário.
 *
 * - **Rotas Configuradas:**
 *   - `/`: Caminho raiz da aplicação que renderiza o componente `Table`. `Table` é um componente que provavelmente lida com a exibição de uma tabela de seleção ou de dados.
 *   - `/ide`: Uma rota que leva ao componente `Ide`, que pode ser um ambiente de desenvolvimento integrado ou uma interface específica dentro da aplicação.
 *
 * A navegação é gerenciada utilizando o `BrowserRouter` do React Router, que permite navegação amigável para SPA (Single Page Application).
 * O `Routes` contém componentes `Route` que mapeiam um caminho de URL a um componente React.
 *
 * @returns {JSX.Element} Código JSX que configura o roteamento da aplicação e renderiza os componentes correspondentes às rotas.
 */
function App(): JSX.Element {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Intro />} />
        <Route path="/ide" element={<Ide />} />
        <Route path="/table" element={<Table />} />
        <Route path="/game" element={<Game />} />
      </Routes>
    </Router>
  );
}

export default App;
