/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import MiniSidebar from "../sidebar"

/**
 * Componente Folder
 *
 * Este componente funcional renderiza um contêiner que inclui a `MiniSidebar`.
 * Ele estrutura a apresentação da barra lateral dentro de uma área delimitada com bordas arredondadas.
 *
 * - **Elementos Renderizados:**
 *   - `div`: Contêiner principal que define a área da pasta.
 *     - Aplica classes utilitárias do Tailwind CSS para definir largura, margens, bordas e outras propriedades de estilo.
 *   - `MiniSidebar`: Componente de barra lateral importado e renderizado dentro do contêiner.
 *
 * - **Estilização:**
 *   - Utiliza classes do Tailwind CSS para aplicar estilos de bordas, preenchimento, arredondamento e cores de fundo.
 *
 * - **Layout:**
 *   - A barra lateral é exibida dentro de um contêiner flexível que alinha os itens ao centro e justifica o conteúdo no início.
 *
 * @returns {JSX.Element} Código JSX para renderizar o contêiner da pasta com a barra lateral inclusa.
 */

export function Folder() {
  return (
    <div className="flex w-[34.5%] ml-20 border-linha border-2 rounded-3xl h-full bg-white items-center justify-start">
      <div className="h-full w-full">
        <MiniSidebar />
      </div>
    </div>
  )
}
