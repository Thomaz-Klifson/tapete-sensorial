/* eslint-disable prettier/prettier */
import { FaCloud, FaCircle, FaStar } from "react-icons/fa";
import { TbHexagonFilled } from "react-icons/tb";
import { GoHeartFill } from "react-icons/go";
import { IoMoon } from "react-icons/io5";
import { FaSquare } from "react-icons/fa6";
import { BsSuitDiamondFill, BsTriangleFill } from "react-icons/bs";

/**
 * Array de objetos `blocks`
 *
 * Cada objeto representa um bloco contendo um ícone, a cor da borda e a cor de fundo.
 * Alguns blocos têm uma propriedade adicional `rotate` para rotacionar o ícone.
 */
const blocks = [
    { Icon: FaCloud, borderColor: "border-yellow-200", bgColor: "bg-yellow-200" },
    { Icon: FaCircle, borderColor: "border-fundo", bgColor: "bg-fundo" },
    { Icon: BsTriangleFill, borderColor: "border-green-200", bgColor: "bg-green-200" },
    { Icon: GoHeartFill, borderColor: "border-green-200", bgColor: "bg-green-200" },
    { Icon: IoMoon, borderColor: "border-yellow-200", bgColor: "bg-yellow-200" },
    { Icon: FaSquare, borderColor: "border-fundo", bgColor: "bg-fundo" },
    { Icon: BsSuitDiamondFill, borderColor: "border-fundo", bgColor: "bg-fundo", rotate: "rotate-90" },
    { Icon: TbHexagonFilled, borderColor: "border-green-200", bgColor: "bg-green-200", rotate: "rotate-90" },
    { Icon: FaStar, borderColor: "border-yellow-200", bgColor: "bg-yellow-200" }
];

/**
 * Componente Squares
 *
 * Este componente renderiza uma grade de quadrados contendo ícones.
 *
 * @returns {JSX.Element} JSX para renderizar o componente Squares.
 */
export default function Squares(): JSX.Element {
    return (
        <div className="h-full w-full grid grid-cols-3 gap-x-[4.5rem] gap-y-[1.5rem] px-6 py-2">
            {blocks.map((block, index) => (
                <div
                    key={index}
                    className={`flex items-center justify-center h-[6rem] w-[6rem] rounded-lg border-2 ${block.borderColor} ${block.bgColor}`}
                >
                    <block.Icon className={`text-white text-4xl ${block.rotate || ""}`} />
                </div>
            ))}
        </div>
    );
}
