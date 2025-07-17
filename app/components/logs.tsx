import Image from "next/image";
import { LogItem } from "../dashboard/page";

interface Props {
  logs: LogItem[];
}

export default function LogEntrada({ logs }: { logs: LogItem[] }) {
  return (
    <div className="space-y-4">
      {logs.map((log) => (
        <div key={log.id} className="flex items-center gap-4">
          <img src={log.avatar} className="w-10 h-10 rounded-full" alt="Avatar" />
          <div>
            <p className="font-bold">{log.nome}</p>
            <p className="text-sm text-gray-600">{log.mensagem}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

