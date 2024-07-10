/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Button, Label, Modal, TextInput } from "flowbite-react";
import { useState, useEffect } from "react";
import { Patient } from "../lista";

/**
 * Componente ModalEdit
 *
 * Este componente funcional renderiza um modal para editar um paciente existente.
 * Utiliza componentes da biblioteca `flowbite-react` para criar uma interface de usuário consistente e acessível.
 *
 * @param {Object} props - Propriedades recebidas pelo componente.
 * @param {boolean} props.openModal - Indica se o modal deve ser exibido.
 * @param {Function} props.onCloseModal - Função para fechar o modal.
 * @param {Function} props.updatePatient - Função para atualizar um paciente existente.
 * @param {Patient} props.patient - Dados do paciente a ser editado.
 * @param {boolean} props.highContrast - Indica se o modo de alto contraste está ativado.
 *
 * @returns {JSX.Element} Código JSX para renderizar o modal de edição de pacientes.
 */
export function ModalEdit({ openModal, onCloseModal, updatePatient, patient, highContrast }): JSX.Element {
  const [editPatientName, setEditPatientName] = useState("");
  const [editPatientAge, setEditPatientAge] = useState("");
  const [editPatientSerial, setEditPatientSerial] = useState("");
  const [editPatientTO, setEditPatientTO] = useState("");

  // Efeito para inicializar os campos de edição com os dados do paciente
  useEffect(() => {
    if (patient) {
      setEditPatientName(patient.name);
      setEditPatientAge(patient.age.toString());
      setEditPatientSerial(patient.serial.toString());
      setEditPatientTO(patient.to);
    }
  }, [patient]);

  // Função para atualizar os dados do paciente
  function handleUpdatePatient() {
    if (editPatientName && editPatientAge) {
      const updatedPatient: Patient = {
        ...patient,
        name: editPatientName,
        age: parseInt(editPatientAge, 10),
        serial: parseInt(editPatientSerial, 10),
        to: editPatientTO,
      };
      updatePatient(updatedPatient);
      onCloseModal();
    }
  }

  return (
    <Modal show={openModal} size="md" className="" onClose={onCloseModal} popup>
      <Modal.Header className="" />
      <Modal.Body>
        <div className={`space-y-6 ${highContrast ? 'bg-black text-yellow-300' : ''}`}>
          <h3 className={`text-xl font-medium text-center ${highContrast ? 'text-yellow-300' : 'text-gray-900 dark:text-white'}`}>
            Editar Paciente
          </h3>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="name" value="Nome do paciente" className={highContrast ? 'text-yellow-300' : 'text-gray-900 dark:text-white'} />
            </div>
            <TextInput
              id="name"
              placeholder="Nome do paciente"
              value={editPatientName}
              onChange={(event) => setEditPatientName(event.target.value)}
              required
              className={`dark:bg-gray-800 ${highContrast ? 'bg-black text-yellow-300' : 'text-gray-900 dark:text-white'}`}
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="age" value="Idade do paciente" className={highContrast ? 'text-yellow-300' : 'text-gray-900 dark:text-white'} />
            </div>
            <TextInput
              id="age"
              type="number"
              placeholder="Idade do paciente"
              value={editPatientAge}
              onChange={(event) => setEditPatientAge(event.target.value)}
              required
              className={`dark:bg-gray-800 ${highContrast ? 'bg-black text-yellow-300' : 'text-gray-900 dark:text-white'}`}
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="serial" value="Prontuário do paciente" className={highContrast ? 'text-yellow-300' : 'text-gray-900 dark:text-white'} />
            </div>
            <TextInput
              id="serial"
              type="number"
              placeholder="Prontuário do paciente"
              value={editPatientSerial}
              onChange={(event) => setEditPatientSerial(event.target.value)}
              required
              className={`dark:bg-gray-800 ${highContrast ? 'bg-black text-yellow-300' : 'text-gray-900 dark:text-white'}`}
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="to" value="TO Responsável" className={highContrast ? 'text-yellow-300' : 'text-gray-900 dark:text-white'} />
            </div>
            <TextInput
              id="to"
              placeholder="TO Responsável"
              value={editPatientTO}
              onChange={(event) => setEditPatientTO(event.target.value)}
              required
              className={`dark:bg-gray-800 ${highContrast ? 'bg-black text-yellow-300' : 'text-gray-900 dark:text-white'}`}
            />
          </div>
          <div className="w-full flex justify-center">
            <Button onClick={handleUpdatePatient} color={"purple"} className={`${highContrast ? 'bg-black text-yellow-300' : 'text-white dark:text-gray-900'}`}>
              Atualizar Paciente
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
