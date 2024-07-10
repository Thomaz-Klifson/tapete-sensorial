/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import store from 'store';
import styles from '../styles/Lista.module.css';

// Definição do tipo para um objeto Paciente
export type Patient = {
  id: number;
  name: string;
  age: number;
  serial: number;
  to: string;
};

/**
 * Componente Lista
 *
 * Este componente representa uma lista de pacientes com checkboxes ao lado do nome de cada paciente.
 * Ele mantém uma lista de pacientes selecionados e alterna seu estado marcado ao clicar na checkbox correspondente.
 * Adicionalmente, ao clicar na linha do paciente, o usuário é redirecionado para a página /ide.
 *
 * - **Variáveis de Estado:**
 *   - `checkedItems`: Um array de IDs de pacientes selecionados.
 *   - `patients`: Um array contendo informações sobre cada paciente (ID, nome, idade, prontuário e TO).
 *   - `newPatientName`: Armazena o nome do novo paciente.
 *   - `newPatientAge`: Armazena a idade do novo paciente.
 *   - `newPatientSerial`: Armazena o prontuário do novo paciente.
 *   - `newPatientTO`: Armazena o TO responsável pelo novo paciente.
 *
 * - **Funções:**
 *   - `checkboxChange`: Alterna o status de seleção de um paciente, adicionando/removendo seu ID do estado `checkedItems`.
 *   - `handleClickRow`: Redireciona o usuário para a página /ide ao clicar na linha de um paciente.
 *   - `handleAddPatient`: Adiciona um novo paciente à lista e armazena os dados no local storage.
 *
 * @returns {JSX.Element} Código JSX para renderizar a lista de pacientes com checkboxes e funcionalidade de redirecionamento.
 */
export default function Lista({
  patients,
  setPatients,
  showForm,
  checkedItems,
  setCheckedItems
}: {
  patients: Patient[];
  setPatients: React.Dispatch<React.SetStateAction<Patient[]>>;
  showForm: boolean;
  checkedItems: number[];
  setCheckedItems: React.Dispatch<React.SetStateAction<number[]>>;
}): JSX.Element {
  const navigate = useNavigate();
  const [newPatientName, setNewPatientName] = useState<string>('');
  const [newPatientAge, setNewPatientAge] = useState<number | ''>('');
  const [newPatientSerial, setNewPatientSerial] = useState<number | ''>('');
  const [newPatientTO, setNewPatientTO] = useState<string>('');

  // Armazena a lista de pacientes no local storage sempre que ela for atualizada
  useEffect(() => {
    store.set('patients', patients);
  }, [patients]);

  // Alterna o estado de seleção do paciente ao clicar na checkbox
  function checkboxChange(patientId: number, event: React.MouseEvent) {
    event.stopPropagation(); // Evita que o evento de clique na linha seja acionado
    setCheckedItems((prevCheckedItems) => {
      return prevCheckedItems.includes(patientId)
        ? prevCheckedItems.filter((id) => id !== patientId)
        : [...prevCheckedItems, patientId];
    });
  }

  // Redireciona o usuário para a página /ide ao clicar na linha do paciente
  function handleClickRow() {
    navigate('/ide');
  }

  // Adiciona um novo paciente à lista
  function handleAddPatient() {
    if (newPatientName && newPatientAge) {
      const newPatient: Patient = {
        id: patients.length + 1,
        name: newPatientName,
        age: newPatientAge as number,
        serial: newPatientSerial as number,
        to: newPatientTO
      };
      setPatients([...patients, newPatient]);
      setNewPatientName('');
      setNewPatientAge('');
      setNewPatientSerial('');
      setNewPatientTO('');
    }
  }

  return (
    <>
      {patients.map((patient) => (
        <div
          key={patient.id}
          className={styles.container}
          onClick={handleClickRow}
          style={{ cursor: 'pointer' }}
        >
          <input
            type="checkbox"
            onClick={(event) => checkboxChange(patient.id, event)}
            checked={checkedItems.includes(patient.id)}
          />
          <div>
            <p>
              {patient.name}, {patient.age} anos, {patient.serial}, {patient.to}
            </p>
          </div>
        </div>
      ))}
      <div className={styles.containerP}></div>
      {showForm && (
        <div>
          <input
            type="text"
            value={newPatientName}
            onChange={(e) => setNewPatientName(e.target.value)}
            placeholder="Nome do paciente"
          />
          <input
            type="number"
            value={newPatientAge}
            onChange={(e) => setNewPatientAge(Number(e.target.value))}
            placeholder="Idade do paciente"
          />
          <input
            type="number"
            value={newPatientSerial}
            onChange={(e) => setNewPatientSerial(Number(e.target.value))}
            placeholder="Prontuário do Paciente"
          />
          <input
            type="text"
            value={newPatientTO}
            onChange={(e) => setNewPatientTO(e.target.value)}
            placeholder="TO Responsável"
          />
          <button onClick={handleAddPatient} className={styles.add}>
            Adicionar Paciente
          </button>
        </div>
      )}
    </>
  );
}
