/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Button, Label } from 'flowbite-react';
import { FaPlay } from "react-icons/fa6";
import Squares from './squares';

/**
 * Componente Rug
 *
 * Este componente renderiza uma área de tapete com um conjunto de quadrados (`Squares`) e um botão de play.
 * A área do tapete é estilizada com bordas arredondadas e um fundo branco.
 *
 * @returns {JSX.Element} JSX para renderizar o componente Rug.
 */
export function Rug() {

  return (
    <div className="flex w-[44.5%] h-full ml-[5%] items-center justify-center">
      <Label className="relative flex h-full w-full flex-col items-center justify-center rounded-3xl border-linha border-2 bg-white">
        <div className='flex gap-x-5'>
          {/* Renderiza o componente Squares */}
          <Squares />
        </div>
        <div className='absolute bottom-0 right-0 m-4'>
          {/* Botão de play no canto inferior direito */}
          <Button className='w-9 flex justify-center items-center rounded-full h-9 bg-linha'>
            <FaPlay className='text-verde'/>
          </Button>
        </div>
      </Label>
    </div>
  );
}
