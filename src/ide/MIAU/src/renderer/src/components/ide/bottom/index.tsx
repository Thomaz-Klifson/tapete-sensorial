/* eslint-disable prettier/prettier */
import { FileInput, Label } from 'flowbite-react';

/**
 * Componente Upload
 *
 * Este componente renderiza uma área de upload de arquivos que permite ao usuário
 * selecionar um arquivo para upload ou arrastar e soltar o arquivo na área designada.
 *
 * - **Funções:**
 *   - `handleFileChange`: Lida com a mudança de arquivo no input, lê o arquivo como ArrayBuffer
 *     e chama a função `uploadFile` da API para fazer o upload do arquivo.
 *
 * - **Renderização:**
 *   - Renderiza um `Label` que atua como área de dropzone.
 *   - Renderiza um `FileInput` que está escondido e é acionado ao clicar na área de dropzone.
 *
 * @returns {JSX.Element} JSX para renderizar o componente Upload.
 */
export function Upload() {

  /**
   * Função handleFileChange
   *
   * Esta função é chamada quando um arquivo é selecionado no input. Ela lê o arquivo
   * como um ArrayBuffer e envia o arquivo usando a API `uploadFile`.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} event - Evento de mudança do input de arquivo.
   */
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const data = reader.result;
        if (data instanceof ArrayBuffer) {
          window.api.uploadFile({ name: file.name, data: new Uint8Array(data) });
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  return (
    <div className="flex w-[40%] pl-[5%] items-center justify-center">
      <Label
        htmlFor="dropzone-file"
        className="flex h-[20rem] w-full cursor-pointer flex-col items-center justify-center rounded-3xl border-linha border-2 bg-white hover:bg-gray-100 dark:border-gray-600"
      >
        <div className="px-[15.5%] py-[11%] border-dashed rounded-3xl border-2 border-linha">
          <div className="flex flex-col items-center justify-center pb-6 pt-5">
            <svg
              className="mb-4 h-8 w-8 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 16"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
              />
            </svg>
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="font-semibold">Clique para fazer upload</span> ou arraste aqui
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400"></p>
          </div>
        </div>
        <FileInput id="dropzone-file" className="hidden" onChange={handleFileChange} />
      </Label>
    </div>
  );
}
