/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Button, Label, Modal, Select, TextInput } from "flowbite-react";
import React, { useState } from "react";

interface ModalUploadProps {
  openModal: boolean;
  onCloseModal: () => void;
  onConfirmUpload: (fileType: string, fileName: string) => void;
  highContrast: boolean;
}

export function ModalUpload({ openModal, onCloseModal, onConfirmUpload, highContrast }: ModalUploadProps): JSX.Element {
  const [fileName, setFileName] = useState("");
  const [fileType, setFileType] = useState("");

  function handleConfirmUpload() {
    if (fileType === "audio" && fileName.length > 8) {
      alert("O nome do arquivo deve ter no máximo 8 caracteres.");
      return;
    }

    if (fileType) {
      onConfirmUpload(fileType, fileName);
      setFileName("");
      setFileType("");
      onCloseModal();
    }
  }

  return (
    <Modal show={openModal} size="md" onClose={onCloseModal} popup>
      <Modal.Header />
      <Modal.Body>
        <div className={`space-y-6 ${highContrast ? 'bg-black text-yellow-300' : ''}`}>
          <h3 className={`text-xl font-medium text-center ${highContrast ? 'text-yellow-300' : 'text-gray-900 dark:text-white'}`}>
            Upload de Arquivo
          </h3>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="fileType" value="Tipo do arquivo" className={highContrast ? 'text-yellow-300' : 'text-gray-900 dark:text-white'} />
            </div>
            <Select
              id="fileType"
              value={fileType}
              onChange={(event) => setFileType(event.target.value)}
              required
              className={`dark:bg-gray-800 ${highContrast ? 'bg-black text-yellow-300' : 'text-gray-900 dark:text-white'}`}
            >
              <option value="" disabled>Selecione o tipo</option>
              <option value="bg">Cenário</option>
              <option value="actor">Personagem</option>
              <option value="audio">Áudio</option>
            </Select>
          </div>
          {fileType === "audio" && (
            <div>
              <div className="mb-2 block">
                <Label htmlFor="fileName" value="Nome do áudio" className={highContrast ? 'text-yellow-300' : 'text-gray-900 dark:text-white'} />
              </div>
              <TextInput
                id="fileName"
                placeholder="Ex: 'Latido de Pinscher'"
                value={fileName}
                onChange={(event) => setFileName(event.target.value)}
                required
                className={`dark:bg-gray-800 ${highContrast ? 'bg-black text-yellow-300' : 'text-gray-900 dark:text-white'}`}
              />
            </div>
          )}
          <div className="w-full flex justify-center">
            <Button onClick={handleConfirmUpload} color={"purple"} className={`${highContrast ? 'bg-black text-yellow-300' : 'text-white dark:text-gray-900'}`}>
              Confirmar
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
