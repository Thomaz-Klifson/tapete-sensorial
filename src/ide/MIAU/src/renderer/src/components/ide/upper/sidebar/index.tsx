/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { useState } from "react";
import { Sidebar, CustomFlowbiteTheme, Tooltip } from "flowbite-react";
import { ImLeaf } from "react-icons/im";
import { IoPawSharp } from "react-icons/io5";
import { FaMusic } from "react-icons/fa";
import Animal from "./animal";
import BackGround from "./bg";
import Sound from "./sound";

/**
 * Componente MiniSidebar
 *
 * Este componente funcional renderiza uma barra lateral minimalista utilizando componentes da biblioteca `flowbite-react`.
 * A barra lateral inclui ícones que representam diferentes seções ou funcionalidades da aplicação.
 *
 * - **Elementos Renderizados:**
 *   - `Sidebar`: Componente principal que contém a estrutura da barra lateral.
 *   - `Sidebar.Items`: Contêiner para os itens da barra lateral.
 *   - `Sidebar.ItemGroup`: Agrupamento de itens dentro da barra lateral.
 *   - `Sidebar.Item`: Itens individuais dentro da barra lateral, cada um com um ícone correspondente.
 *   - `Tooltip`: Componente para exibir dicas de ferramentas ao passar o mouse sobre os ícones.
 *
 * - **Customização do Tema:**
 *   - O tema da barra lateral é personalizado utilizando a propriedade `theme` do `flowbite-react`.
 *   - As classes CSS personalizadas são aplicadas para ajustar a aparência e o comportamento da barra lateral.
 *
 * @returns {JSX.Element} Código JSX para renderizar a barra lateral minimalista com ícones interativos.
 */
export default function MiniSidebar() {
  const [activeTab, setActiveTab] = useState('cenario');  // Estado para gerenciar a aba ativa

  // Customização do tema da barra lateral
  const customTheme: CustomFlowbiteTheme['sidebar'] = {
    root: {
      base: 'bg-verde border-r-2 border-r-linha rounded-l-3xl h-full flex flex-col justify-center',
      inner: 'bg-verde'
    }
  };

  return (
    <div className="relative z-30 flex w-full h-full">
      <Sidebar theme={customTheme} className="w-[3.5rem] h-full">
        <Sidebar.Items>
          <Sidebar.ItemGroup className="flex flex-col items-center space-y-4">
            <Tooltip content="Cenário" placement="right">
              <Sidebar.Item
                href="#"
                icon={ImLeaf}
                className={`pl-[2rem] w-10 flex justify-center hover:bg-fundo ${activeTab === 'cenario' && 'bg-fundo'}`}
                onClick={() => setActiveTab('cenario')}
              />
            </Tooltip>
            <Tooltip content="Personagem" placement="right">
              <Sidebar.Item
                href="#"
                icon={IoPawSharp}
                className={`pl-[2rem] w-10 flex justify-center hover:bg-fundo ${activeTab === 'animal' && 'bg-fundo'}`}
                onClick={() => setActiveTab('animal')}
              />
            </Tooltip>
            <Tooltip content="Som" placement="right" className="">
              <Sidebar.Item
                href="#"
                icon={FaMusic}
                className={`pl-[2rem] w-10 flex justify-center hover:bg-fundo ${activeTab === 'sound' && 'bg-fundo'}`}
                onClick={() => setActiveTab('sound')}
              />
            </Tooltip>
          </Sidebar.ItemGroup>
        </Sidebar.Items>
      </Sidebar>
      <div className="flex-1">
        <div style={{ display: activeTab === 'cenario' ? 'block' : 'none' }}>
          <BackGround />
        </div>
        <div style={{ display: activeTab === 'animal' ? 'block' : 'none' }}>
          <Animal />
        </div>
        <div style={{ display: activeTab === 'sound' ? 'block' : 'none' }}>
          <Sound />
        </div>
      </div>
    </div>
  );
}
