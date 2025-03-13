import { useContext, useState } from 'react';
import { Button, Modal, Textarea } from 'flowbite-react';
import { FaPlay } from 'react-icons/fa';
import { BlockContext } from '@renderer/context/sound';
import { useNavigate } from 'react-router-dom';

export function Note() {
  const { blockAudios, blockImages, blockBackgrounds } = useContext(BlockContext);
  const [response, setResponse] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editableCode, setEditableCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const code = `programa "000000"
var
    numero tecla;
    texto cenario_1, cenario_2, cenario_3, cenario_4, cenario_5, cenario_6, cenario_7, cenario_8, cenario_9;
    texto imagem_1, imagem_2, imagem_3, imagem_4, imagem_5, imagem_6, imagem_7, imagem_8, imagem_9;
    texto audio_1, audio_2, audio_3, audio_4, audio_5, audio_6, audio_7, audio_8, audio_9;
    texto verificador;
    numero imagem;
{
    imagem: criar_imagem("branco.png", 2000, 2000); 
    limpar();

    cenario_1: "${blockBackgrounds['bg-0'].name}";
    cenario_2: "${blockBackgrounds['bg-1'].name}";
    cenario_3: "${blockBackgrounds['bg-2'].name}";
    cenario_4: "${blockBackgrounds['bg-3'].name}";
    cenario_5: "${blockBackgrounds['bg-4'].name}";
    cenario_6: "${blockBackgrounds['bg-5'].name}";
    cenario_7: "${blockBackgrounds['bg-6'].name}";
    cenario_8: "${blockBackgrounds['bg-7'].name}";
    cenario_9: "${blockBackgrounds['bg-8'].name}";
    imagem_1: "${blockImages['animal-0'].name}";
    imagem_2: "${blockImages['animal-1'].name}";
    imagem_3: "${blockImages['animal-2'].name}";
    imagem_4: "${blockImages['animal-3'].name}";
    imagem_5: "${blockImages['animal-4'].name}";
    imagem_6: "${blockImages['animal-5'].name}";
    imagem_7: "${blockImages['animal-6'].name}";
    imagem_8: "${blockImages['animal-7'].name}";
    imagem_9: "${blockImages['animal-8'].name}";
    audio_1: "${blockAudios['sound-0'].name}";
    audio_2: "${blockAudios['sound-1'].name}";
    audio_3: "${blockAudios['sound-2'].name}";
    audio_4: "${blockAudios['sound-3'].name}";
    audio_5: "${blockAudios['sound-4'].name}";
    audio_6: "${blockAudios['sound-5'].name}";
    audio_7: "${blockAudios['sound-6'].name}";
    audio_8: "${blockAudios['sound-7'].name}";
    audio_9: "${blockAudios['sound-8'].name}";
    
     enquanto (v)
    {
        tecla: ler();
        se (tecla = 1){
            se (cenario_1 != verificador) {
                inicializar_com_imagem(cenario_1);
            }
            se (imagem_1 != verificador){
                redefinir_imagem(imagem, imagem_1, 300,150);
            }
             se (audio_1 != verificador){
                tocar(audio_1);
            }
        }
        se (tecla = 2){
            se (cenario_2 != verificador) {
                inicializar_com_imagem(cenario_2);
            }
            se (imagem_2 != verificador){
                redefinir_imagem(imagem, imagem_2, 300,150);
            }
            se (audio_2 != verificador){
                tocar(audio_2);
            }
        }
        se (tecla = 3){
            se (cenario_3 != verificador) {
                inicializar_com_imagem(cenario_3);
            }
            se (imagem_3 != verificador){
                redefinir_imagem(imagem, imagem_3, 300,150);
            }
            se (audio_3 != verificador){
                tocar(audio_3);
            }
        }
        se (tecla = 4){
            se (cenario_4 != verificador) {
                inicializar_com_imagem(cenario_4);
            }
            se (imagem_4 != verificador){
                redefinir_imagem(imagem, imagem_4, 300,150);
            }
            se (audio_4 != verificador){
                tocar(audio_4);
            }
        }
        se (tecla = 5){
            se (cenario_5 != verificador) {
                inicializar_com_imagem(cenario_5);
            }
            se (imagem_5 != verificador){
                redefinir_imagem(imagem, imagem_5, 300,150);
            }
            se (audio_5 != verificador){
                tocar(audio_5);
            }
        }
        se (tecla = 6){
            se (cenario_6 != verificador) {
                inicializar_com_imagem(cenario_6);
            }
            se (imagem_6 != verificador){
                redefinir_imagem(imagem, imagem_6, 300,150);
            }
            se (audio_6 != verificador){
                tocar(audio_6);
            }
        }
        se (tecla = 7){
            se (cenario_7 != verificador) {
                inicializar_com_imagem(cenario_7);
            }
            se (imagem_7 != verificador){
                redefinir_imagem(imagem, imagem_7, 300,150);
            }
            se (audio_7 != verificador){
                tocar(audio_7);
            }
        }
        se (tecla = 8){
            se (cenario_8 != verificador) {
                inicializar_com_imagem(cenario_8);
            }
            se (imagem_8 != verificador){
                redefinir_imagem(imagem, imagem_8, 300,150);
            }
            se (audio_8 != verificador){
                tocar(audio_8);
            }
        }
        se (tecla = 9){
            se (cenario_9 != verificador) {
                inicializar_com_imagem(cenario_9);
            }
            se (imagem_9 != verificador){
                redefinir_imagem(imagem, imagem_9, 300,150);
            }
            se (audio_9 != verificador){
                tocar(audio_9);
            }
        }
        esperar(150);
    } 
}`

  const handlePlay = async () => {
    try {
      setErrorMessage('');
      const res = await fetch('http://127.0.0.1:5000/compilador', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ codigo: code })
      });
      const data = await res.json();
      setResponse(JSON.stringify(data, null, 2));

      if (data.status === 'error') {
        setErrorMessage(data.message);
      } else {
        await window.api.saveJavaScript(data.javascript);
        navigate('/game');
      }
    } catch (error) {
      setErrorMessage(`Erro: ${JSON.stringify(error, null, 2)}`);
    }
  };

  const handleEditCode = () => {
    setEditableCode(code);
    setShowModal(true);
  };

  const handleSendCode = async () => {
    try {
      setErrorMessage('');
      const res = await fetch('http://127.0.0.1:5000/compilador', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ codigo: editableCode })
      });
      const data = await res.json();
      setResponse(JSON.stringify(data, null, 2));

      if (data.status === 'error') {
        setErrorMessage(data.message);
      } else {
        setShowModal(false);
        await window.api.saveJavaScript(data.javascript);
        navigate('/game');
      }
    } catch (error) {
      setErrorMessage(`Erro: ${JSON.stringify(error, null, 2)}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center relative">
      {errorMessage && (
        <div className="bg-red-500 text-white p-2 rounded-md mb-4">
          {errorMessage}
        </div>
      )}
      <div className='absolute bottom-0 right-0 m-4 flex space-x-2'>
        {/* <Button onClick={handleEditCode} className='w-[7.8rem] hover:bg-linha text-verde flex justify-center items-center rounded-lg h-9 bg-linha'>
          Editar Código
        </Button> */}
        <Button onClick={handlePlay} className='w-9 hover:bg-linha flex justify-center items-center rounded-full h-9 bg-linha'>
          <FaPlay className='text-verde' />
        </Button>
      </div>

      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <Modal.Header>Editar Código</Modal.Header>
        <Modal.Body>
          <Textarea
            value={editableCode}
            onChange={(e) => setEditableCode(e.target.value)}
            rows={10}
          />
        </Modal.Body>
        <Modal.Footer className="flex justify-end space-x-2">
          {errorMessage && (
            <div className="bg-red-500 text-white p-2 rounded-md">
              {errorMessage}
            </div>
          )}
          <Button onClick={handleSendCode} color="purple">Enviar</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
