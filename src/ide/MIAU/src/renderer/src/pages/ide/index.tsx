/* eslint-disable prettier/prettier */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../assets/main.css';
import Floor from '../../assets/Floor.png';
import { Upload } from '@renderer/components/ide/bottom/upload/upload';
import { Rug } from '@renderer/components/ide/upper/rug';
import Console from '../../assets/Console.png';
import { Folder } from '@renderer/components/ide/upper/folder';
import { Modal, Button, TextInput } from 'flowbite-react';
import { FaPlay, FaArrowLeft } from 'react-icons/fa6'; // Importe o ícone de voltar
import { ModalTeste } from '@renderer/components/ide/bottom/upload/modal/teste';
import { Smile } from 'lucide-react';
import { Note } from '@renderer/components/ide/bottom/note';

/**
 * Componente Ide
 *
 * Este componente funcional renderiza a interface principal da IDE.
 * Ele inclui elementos visuais como imagens de fundo e componentes interativos como `Upload` e `Rug`.
 * Utiliza a biblioteca `react-router-dom` para navegação.
 *
 * - **Elementos Renderizados:**
 *   - `img`: Imagem de fundo e ícones interativos que representam funcionalidades futuras.
 *   - `Rug`: Componente para entrada de código e exibição de resposta.
 *   - `Upload`: Componente para upload de arquivos.
 *   - `Note`: Componente para anotações.
 *
 * - **Funcionalidades de Acessibilidade:**
 *   - Adicionados atributos `alt` para imagens, fornecendo descrições textuais.
 *   - Utilizadas classes do Tailwind CSS para garantir bom contraste e legibilidade.
 *
 * @returns {JSX.Element} Código JSX para renderizar a interface principal da IDE.
 */

function Ide(): JSX.Element {
  const navigate = useNavigate(); // Hook para navegação
  const [showModal, setShowModal] = useState(false); // Estado para controlar a exibição do modal
  const [inputValue, setInputValue] = useState(''); // Estado para armazenar o valor do input

  // Função para lidar com a mudança do valor do input
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  // Função para lidar com o envio do formulário
  const handleSubmit = () => {
    alert(`Input value: ${inputValue}`);
    setShowModal(false);
  };

  return (
    <>
      <div className="h-screen w-screen bg-fundo relative">
        {/* Ícone de voltar */}
        <FaArrowLeft 
          className="absolute top-4 left-4 text-2xl cursor-pointer"
          onClick={() => navigate('/table')}
        />
        {/* Imagem de fundo */}
        <img
          src={Floor}
          className="absolute bottom-0 w-full z-0"
          alt="Imagem de grama que fica no fundo da tela"
        />
        <div className="relative z-10  h-full flex flex-col justify-center ml-[4.5rem]">
          {/* Componente Folder na metade superior da tela */}
          <div className="h-[50%] flex ">
            <Folder />
          </div>
          {/* Componentes Upload e Note na metade inferior da tela */}
          <div className="pt-10 flex gap-x-[5.7%]">
            <Upload />
            <Note />
          </div>
        </div>
      </div>
    </>
  );
}

export default Ide;
