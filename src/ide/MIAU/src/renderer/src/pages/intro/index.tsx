/* eslint-disable prettier/prettier */
import Floor from '../../assets/Floor.png';
import Fox from '../../assets/Fox.png'; 
import Shadow from '../../assets/Shadow.png';

/**
 * Componente Intro
 *
 * Este componente funcional renderiza uma tela de introdução com uma imagem de fundo,
 * uma raposa e uma sombra, e um botão para acessar a IDE. Utiliza Tailwind CSS para o estilo.
 *
 * - **Elementos Renderizados:**
 *   - `img`: Imagem de fundo, raposa e sombra.
 *   - `h1` e `h2`: Títulos de boas-vindas.
 *   - `button`: Botão para acessar a IDE.
 *
 * - **Funcionalidades de Estilo:**
 *   - Utiliza Tailwind CSS para layout responsivo e estilo.
 *   - Ajustes de posição e transformação para a raposa e a sombra.
 *
 * @returns {JSX.Element} Código JSX para renderizar a tela de introdução.
 */

const Intro = () => {
  return (
    <div className="h-screen w-screen bg-fundo relative" style={{ fontFamily: 'Comic Sans MS, Comic Sans, cursive' }}>
      {/* Imagem de fundo */}
      <img
        src={Floor}
        className="absolute bottom-0 w-full z-0"
        alt="Imagem de grama que fica no fundo da tela"
      />
      <div className="flex flex-col items-center justify-center p-4 relative z-10 h-full">
        <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-4">Nós somos a equipe MIAU</h1>
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-800">Seja bem-vindo(a)</h2>
        </div>
        <div className="relative w-full flex justify-center md:justify-end items-end mb-4 z-10">
          <div className="relative" style={{ bottom: '-20px' }}> {/* Ajustando a posição para baixo */}
            {/* Imagem da sombra */}
            <img
              src={Shadow}
              alt="Sombra abaixo da raposa"
              className="w-3/4 h-auto absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-6 opacity-75 z-10" // Ajustando translate-y
            />
            {/* Imagem da raposa */}
            <img
              src={Fox}
              alt="Imagem de raposa"
              className="w-full h-auto relative z-20"
              style={{ transform: 'translateY(20px)' }} // Ajustando translateY
            />
          </div>
        </div>
        <div className="text-center mt-4 z-30">
          <button
            onClick={() => window.location.href='/table'}
            className="bg-purple-600 text-white px-4 py-2 md:px-6 md:py-3 rounded-full font-bold text-base md:text-lg hover:bg-purple-700"
          >
            Acessar a IDE
          </button>
        </div>
      </div>
    </div>
  );
};

export default Intro;
