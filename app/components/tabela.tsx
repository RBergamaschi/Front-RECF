import Image from "next/image";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";

export type Pessoa = {
  id: number;
  nome: string;
  foto: string;
};

interface Props {
  pessoas: Pessoa[];
  onEditar: (id: number) => void;
  onExcluir: (id: number) => void;
}

export default function Table({ pessoas, onEditar, onExcluir }: Props) {
  return (
    <div className="w-full border border-gray-300 rounded-md overflow-hidden">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="text-left p-2">Foto</th>
            <th className="text-left p-2">Nome Completo</th>
            <th className="text-left p-2">Ação</th>
          </tr>
        </thead>
        <tbody>
          {pessoas.map((pessoa) => (
            <tr key={pessoa.id} className="border-t">
              <td className="p-2">
                <Image
                  src={pessoa.foto}
                  alt={pessoa.nome}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              </td>
              <td className="p-2">{pessoa.nome}</td>
              <td className="p-2 flex gap-2">
                <button
                  onClick={() => onEditar(pessoa.id)}
                  className="bg-blue-600 hover:bg-blue-700 text-white p-1 rounded"
                >
                  <PencilIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onExcluir(pessoa.id)}
                  className="bg-red-700 hover:bg-red-800 text-white p-1 rounded"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
