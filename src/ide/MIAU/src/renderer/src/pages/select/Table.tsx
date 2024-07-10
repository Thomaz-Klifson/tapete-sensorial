/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable prettier/prettier */
import { useState, useEffect, useRef } from 'react'
import { Table as FlowbiteTable, Checkbox, TextInput } from 'flowbite-react'
import { Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Floor from '../../assets/Floor.png'
import store from 'store'
import styles from '../../styles/Table.module.css'
import { Patient } from '../../components/select/lista'
import { ModalADD } from '../../components/select/modal'
import { IoSearch } from "react-icons/io5";
import { MdModeEditOutline } from "react-icons/md";
import { ModalEdit } from '@renderer/components/select/edit'

/**
 * Componente Table
 *
 * Este componente funcional renderiza uma tabela de pacientes com funcionalidades de adição, edição, deleção e busca.
 * Utiliza componentes da biblioteca `flowbite-react` para criar uma interface de usuário consistente e acessível.
 *
 * - **Elementos Renderizados:**
 *   - `FlowbiteTable`: Tabela principal que exibe a lista de pacientes.
 *   - `Checkbox`: Checkbox ao lado de cada paciente para seleção múltipla.
 *   - `TextInput`: Campo de entrada para busca de pacientes.
 *   - `Button`: Botões para adicionar, deletar pacientes e alternar o modo de alto contraste.
 *   - `ModalADD` e `ModalEdit`: Modais para adicionar e editar pacientes.
 *
 * - **Funcionalidades:**
 *   - `handleDeletePatients`: Deleta pacientes selecionados.
 *   - `addPatient`: Adiciona um novo paciente.
 *   - `updatePatient`: Atualiza um paciente existente.
 *   - `handleKeyDown`: Lida com a navegação do teclado e ações na tabela.
 *   - `handleEditFocus` e `handleEditBlur`: Controla o foco no modo de edição.
 *   - `handleDeletePatients`: Deleta os pacientes selecionados.
 *
 * @returns {JSX.Element} Código JSX para renderizar a tabela de pacientes.
 */

export default function Table(): JSX.Element {
  const [patients, setPatients] = useState<Patient[]>(store.get('patients') || [])
  const [checkedItems, setCheckedItems] = useState<number[]>([])
  const [openModalAdd, setOpenModalAdd] = useState(false)
  const [openModalEdit, setOpenModalEdit] = useState(false)
  const [currentPatient, setCurrentPatient] = useState<Patient | null>(null)
  const [highContrast, setHighContrast] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [focusedElement, setFocusedElement] = useState(null)
  const navigate = useNavigate()
  const tableRef = useRef<HTMLDivElement>(null)

  // Armazena os pacientes no local storage sempre que há alterações na lista
  useEffect(() => {
    store.set('patients', patients)
  }, [patients])

  // Função para deletar os pacientes selecionados
  function handleDeletePatients() {
    const newPatients = patients.filter((patient) => !checkedItems.includes(patient.id))
    setPatients(newPatients)
    setCheckedItems([])
  }

  // Função para adicionar um novo paciente
  function addPatient(newPatient: Patient) {
    setPatients([...patients, newPatient])
  }

  // Função para atualizar um paciente existente
  function updatePatient(updatedPatient: Patient) {
    const updatedPatients = patients.map((patient) =>
      patient.id === updatedPatient.id ? updatedPatient : patient
    )
    setPatients(updatedPatients)
  }

  // Filtra os pacientes de acordo com o termo de busca
  const filteredPatients = patients.filter(patient => 
    patient.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.age?.toString().includes(searchTerm) ||
    patient.serial?.toString().includes(searchTerm) ||
    patient.to?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Função para lidar com as ações do teclado na tabela
  const handleKeyDown = (e, patient, index) => {
    if (focusedElement === 'edit' && e.key === 'Enter') {
      setCurrentPatient(patient)
      setOpenModalEdit(true)
    } else if (e.key === 'Enter') {
      navigate('/ide')
    } else if (e.key === ' ') {
      e.preventDefault()
      if (checkedItems.includes(patient.id)) {
        setCheckedItems(checkedItems.filter((item) => item !== patient.id))
      } else {
        setCheckedItems([...checkedItems, patient.id])
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      const nextElement = tableRef.current?.querySelector(`[data-index="${index + 1}"]`)
      nextElement?.focus()
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      const prevElement = tableRef.current?.querySelector(`[data-index="${index - 1}"]`)
      prevElement?.focus()
    }
  }

  // Função para controlar o foco no modo de edição
  const handleEditFocus = () => {
    setFocusedElement('edit')
  }

  // Função para remover o foco no modo de edição
  const handleEditBlur = () => {
    setFocusedElement(null)
  }

  return (
    <div
      className={`h-screen w-screen relative ${highContrast ? 'bg-black text-yellow-300' : 'bg-fundo text-black'}`}
    >
      <img
        src={Floor}
        className={`absolute bottom-0 w-full z-0 ${highContrast ? 'opacity-50' : ''}`}
        alt="Imagem de grama que fica no fundo da tela"
      />
      <div className="flex justify-center">
        <div className="flex flex-col h-full mt-[6%] ">
          <div className={styles.tableContainer}>
            <div
              className={`${styles.tableHeader} ${highContrast ? 'bg-black text-yellow-300' : ''}`}
              role="banner"
              aria-label="Cabeçalho da tabela de pacientes"
            >
              <h4 className="text-xl">Pacientes</h4>
              <div className='w-1/2'>
                <TextInput 
                  icon={IoSearch} 
                  placeholder="Pesquisar" 
                  id="base" 
                  type="text" 
                  sizing="md" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div
                className={`${styles.subbutton} ${highContrast ? 'bg-black text-yellow-300' : ''}`}
                role="group"
                aria-label="Botões de ação"
              >
                <button
                  onClick={handleDeletePatients}
                  className={`${highContrast ? 'py-2 px-6 border text-sm border-yellow-300 text-yellow-300' : `${styles.delete}`}`}
                  aria-label="Deletar pacientes selecionados"
                >
                  <Trash2 />
                  Deletar
                </button>
                <button
                  onClick={() => setOpenModalAdd(true)}
                  className={`${highContrast ? ' py-2 px-6 border text-sm border-yellow-300 text-yellow-300' : `${styles.add}`}`}
                  aria-label="Adicionar novo paciente"
                >
                  + Adicionar
                </button>
                <button
                  onClick={() => setHighContrast(!highContrast)}
                  className={`${highContrast ? 'py-2 w-[6rem] border text-sm border-yellow-300 text-yellow-300' : `${styles.add}`}`}
                  aria-label="Ativar/desativar modo de alto contraste"
                >
                  {highContrast ? 'Desativar Alto Contraste' : 'Ativar Alto Contraste'}
                </button>
              </div>
            </div>
            <div
              className={`${styles.tableBody} overflow-x-auto ${highContrast ? 'bg-black text-yellow-300' : ''}`}
              role="table"
              ref={tableRef}
            >
              <FlowbiteTable hoverable className="">
                <FlowbiteTable.Head>
                  <FlowbiteTable.HeadCell
                    className={`w-1/4 ${highContrast ? 'bg-black text-yellow-300' : ''}`}
                  >
                    Paciente
                  </FlowbiteTable.HeadCell>
                  <FlowbiteTable.HeadCell
                    className={`w-1/4 ${highContrast ? 'bg-black text-yellow-300' : ''}`}
                  >
                    Idade
                  </FlowbiteTable.HeadCell>
                  <FlowbiteTable.HeadCell
                    className={`w-1/4 ${highContrast ? 'bg-black text-yellow-300' : ''}`}
                  >
                    Prontuário
                  </FlowbiteTable.HeadCell>
                  <FlowbiteTable.HeadCell
                    className={`w-1/4 ${highContrast ? 'bg-black text-yellow-300' : ''}`}
                  >
                    TO Responsável
                  </FlowbiteTable.HeadCell>
                  <FlowbiteTable.HeadCell
                    className={` ${highContrast ? 'bg-black text-yellow-300' : ''}`}
                  >
                    Editar
                  </FlowbiteTable.HeadCell>
                </FlowbiteTable.Head>
                <FlowbiteTable.Body
                  className={`divide-y ${highContrast ? 'divide-yellow-300' : ''}`}
                >
                  {filteredPatients.map((patient, index) => (
                    <FlowbiteTable.Row
                      key={patient.id}
                      className={`bg-white text-black font-semibold dark:border-gray-700 dark:bg-gray-800 ${highContrast ? 'bg-black text-yellow-300' : ''} cursor-pointer`}
                      tabIndex={0}
                      data-index={index}
                      onKeyDown={(e) => handleKeyDown(e, patient, index)}
                      onClick={() => navigate('/ide')}
                    >
                      <FlowbiteTable.Cell className="px-4 py-4 flex items-center">
                        <Checkbox
                          className="cursor-pointer"
                          checked={checkedItems.includes(patient.id)}
                          onClick={(event) => {
                            event.stopPropagation();
                            if (checkedItems.includes(patient.id)) {
                              setCheckedItems(checkedItems.filter((item) => item !== patient.id))
                            } else {
                              setCheckedItems([...checkedItems, patient.id])
                            }
                          }}
                          aria-label={`Selecionar ${patient.name}`}
                          tabIndex={-1}
                        />
                        <div className="pl-4">
                          {patient.name}
                        </div>
                      </FlowbiteTable.Cell>
                      <FlowbiteTable.Cell
                        className={`whitespace-nowrap font-medium text-gray-900 dark:text-white ${highContrast ? 'text-yellow-300' : ''}`}
                      >
                        {patient.age} anos
                      </FlowbiteTable.Cell>
                      <FlowbiteTable.Cell
                        className={`whitespace-nowrap font-medium text-gray-900 dark:text-white ${highContrast ? 'text-yellow-300' : ''}`}
                      >
                        {patient.serial}
                      </FlowbiteTable.Cell>
                      <FlowbiteTable.Cell
                        className={`whitespace-nowrap font-medium text-gray-900 dark:text-white ${highContrast ? 'text-yellow-300' : ''}`}
                      >
                        {patient.to}
                      </FlowbiteTable.Cell>
                      <FlowbiteTable.Cell
                        className={`whitespace-nowrap flex justify-center text-purple-600 dark:text-white ${highContrast ? 'text-yellow-300' : ''}`}
                      >
                        <MdModeEditOutline 
                          className='w-5 h-5 cursor-pointer' 
                          onClick={(e) => {
                            e.stopPropagation();
                            setCurrentPatient(patient);
                            setOpenModalEdit(true);
                          }} 
                          tabIndex={0}
                          onFocus={handleEditFocus}
                          onBlur={handleEditBlur}
                          onKeyDown={(e) => handleKeyDown(e, patient, index)}
                          aria-label={`Editar ${patient.name}`}
                        />
                      </FlowbiteTable.Cell>
                    </FlowbiteTable.Row>
                  ))}
                </FlowbiteTable.Body>
              </FlowbiteTable>
            </div>
          </div>
        </div>
      </div>
      <ModalADD
        openModal={openModalAdd}
        onCloseModal={() => setOpenModalAdd(false)}
        addPatient={addPatient}
        highContrast={highContrast}
      />
      <ModalEdit
        openModal={openModalEdit}
        onCloseModal={() => setOpenModalEdit(false)}
        updatePatient={updatePatient}
        patient={currentPatient}
        highContrast={highContrast}
      />
    </div>
  )
}
