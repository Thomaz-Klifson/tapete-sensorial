/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Button, Label, Modal, TextInput } from "flowbite-react";
import { useState } from "react";
import { Patient } from "../lista";

/**
 * Componente ModalADD
 *
 * Este componente funcional renderiza um modal para adicionar um novo paciente.
 * Utiliza componentes da biblioteca `flowbite-react` para criar uma interface de usuário consistente e acessível.
 *
 * - **Elementos Renderizados:**
 *   - `Modal`: Contêiner principal do modal.
 *   - `Modal.Header`: Cabeçalho do modal.
 *   - `Modal.Body`: Corpo do modal onde os campos de entrada são exibidos.
 *   - `Label`: Rótulos para os campos de entrada.
 *   - `TextInput`: Campos de entrada para o nome, idade, prontuário e TO do paciente.
 *   - `Button`: Botão para adicionar o novo paciente.
 *
 * - **Funcionalidades:**
 *   - `handleAddPatient`: Adiciona um novo paciente à lista e fecha o modal, se todos os campos forem válidos.
 *   - `handleNumberChange`: Função de utilidade para garantir que apenas números não negativos sejam aceitos.
 *
 * - **Melhorias de Acessibilidade e Contraste:**
 *   - Adicionados atributos `htmlFor` e `id` para melhorar a acessibilidade.
 *   - Utilizadas classes do Tailwind CSS para melhorar o contraste e a legibilidade.
 *   - Adicionada a opção de tema escuro com cores de texto claras.
 *
 * @param {Object} props - Propriedades recebidas pelo componente.
 * @param {boolean} props.openModal - Indica se o modal deve ser exibido.
 * @param {Function} props.onCloseModal - Função para fechar o modal.
 * @param {Function} props.addPatient - Função para adicionar um novo paciente.
 * @param {boolean} props.highContrast - Indica se o modo de alto contraste está ativado.
 *
 * @returns {JSX.Element} Código JSX para renderizar o modal de adição de pacientes.
 */

export function ModalADD({ openModal, onCloseModal, addPatient, highContrast }): JSX.Element {
  const [newPatientName, setNewPatientName] = useState("");
  const [newPatientAge, setNewPatientAge] = useState("");
  const [newPatientSerial, setNewPatientSerial] = useState("");
  const [newPatientTO, setNewPatientTO] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Função para adicionar um novo paciente, validando todos os campos necessários
  function handleAddPatient() {
    if (!newPatientName || !newPatientAge || !newPatientSerial || !newPatientTO) {
      setErrorMessage("Todos os campos são obrigatórios.");
      return;
    }
    const age = parseInt(newPatientAge, 10);
    const serial = parseInt(newPatientSerial, 10);
    if (age < 0 || serial < 0) {
      setErrorMessage("Idade e Prontuário não podem ser negativos.");
      return;
    }

    const newPatient: Patient = {
      id: Date.now(),
      name: newPatientName,
      age: age,
      serial: serial,
      to: newPatientTO
    };
    addPatient(newPatient);
    setNewPatientName("");
    setNewPatientAge("");
    setNewPatientSerial("");
    setNewPatientTO("");
    setErrorMessage("");
    onCloseModal();
  }

  // Função para garantir que apenas números não negativos sejam aceitos nos campos
  function handleNumberChange(setter) {
    return (event) => {
      const value = event.target.value;
      if (value === "" || (Number.isInteger(Number(value)) && Number(value) >= 0)) {
        setter(value);
      }
    };
  }

  return (
    <>
      <Modal show={openModal} size="md" className="" onClose={onCloseModal} popup>
        <Modal.Header className="" />
        <Modal.Body >
          <div className={`space-y-6 ${highContrast ? 'bg-black text-yellow-300' : ''}`}>
            <h3 className={`text-xl font-medium text-center ${highContrast ? 'text-yellow-300' : 'text-gray-900 dark:text-white'}`}>Adicionar Paciente</h3>
            {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}
            <div>
              <div className="mb-2 block">
                <Label htmlFor="name" value="Nome do paciente" className={highContrast ? 'text-yellow-300' : 'text-gray-900 dark:text-white'} />
              </div>
              <TextInput
                id="name"
                placeholder="Nome do paciente"
                value={newPatientName}
                onChange={(event) => setNewPatientName(event.target.value)}
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
                value={newPatientAge}
                onChange={handleNumberChange(setNewPatientAge)}
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
                value={newPatientSerial}
                onChange={handleNumberChange(setNewPatientSerial)}
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
                value={newPatientTO}
                onChange={(event) => setNewPatientTO(event.target.value)}
                required
                className={`dark:bg-gray-800 ${highContrast ? 'bg-black text-yellow-300' : 'text-gray-900 dark:text-white'}`}
              />
            </div>
            <div className="w-full flex justify-center">
              <Button onClick={handleAddPatient} color={"purple"} className={`${highContrast ? 'bg-black text-yellow-300' : 'text-white dark:text-gray-900'}`}>Adicionar Paciente</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
