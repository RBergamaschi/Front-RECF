"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import NavBar from "../components/navbar";
import LogEntrada from "../components/logs";

export type LogItem = {
  id: number;
  nome: string;
  avatar: string;
  mensagem: string;
};

export default function DashboardPage() {
  const router = useRouter();
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchLogs = async () => {
    if (!token) return;

    setLoading(true);
    try {
      console.log("A URL da API que o frontend está a usar é:", process.env.NEXT_PUBLIC_API_URL);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users_log`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Erro ao buscar logs");

      const data = await res.json();

      const parsedLogs: LogItem[] = data.map((log: any) => ({
        id: log.id,
        nome: log.user?.name || "Desconhecido",
        avatar: log.user?.image_url || "/default-avatar.png",
        mensagem: `Reconhecimento em ${new Date(log.log_time).toLocaleString("pt-BR")}`,
      }));

      setLogs(parsedLogs);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const reconhecerRosto = async () => {
    if (!token || !file) return;

    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("image_file", file);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/recognition/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) throw new Error("Erro ao reconhecer rosto");

      const data = await res.json();

      const log: LogItem = {
        id: Date.now(),
        nome: data.name || "Desconhecido",
        avatar: data.image_url || "/default-avatar.png",
        mensagem: "Rosto reconhecido com sucesso",
      };

      setLogs((prev) => [log, ...prev]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen w-screen bg-white">
      <NavBar />

      <div className="flex flex-col items-center justify-start flex-1 p-8 gap-4">
        <div className="bg-[#F4F4F4] w-[774px] h-[467px] border border-[#B7B7B7] rounded p-4 overflow-y-auto">
          {loading && <p>Carregando...</p>}
          {error && <p className="text-red-600">{error}</p>}
          {!loading && !error && <LogEntrada logs={logs} />}
        </div>
      </div>
    </main>
  );
}
