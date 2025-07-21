"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PlusIcon } from "@heroicons/react/24/solid";
import NavBar from "../components/navbar";
import Table, { Pessoa } from "../components/tabela";
import Modal from "../components/Modal";

export default function PessoasPage() {
  const router = useRouter();
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [fotoFile, setFotoFile] = useState<File | null>(null);

  const [busca, setBusca] = useState("");
  const [pagina, setPagina] = useState(0);

  const [modalCadastroOpen, setModalCadastroOpen] = useState(false);
  const [modalEditarOpen, setModalEditarOpen] = useState<null | Pessoa>(null);
  const [modalExcluirOpen, setModalExcluirOpen] = useState<null | Pessoa>(null);

  const pessoasFiltradas = pessoas.filter((p) =>
    p.nome.toLowerCase().includes(busca.toLowerCase())
  );

  const pessoasPorPagina = 6;
  const totalPaginas = Math.ceil(pessoasFiltradas.length / pessoasPorPagina);
  const pessoasVisiveis = pessoasFiltradas.slice(
    pagina * pessoasPorPagina,
    pagina * pessoasPorPagina + pessoasPorPagina
  );

  const fetchPessoas = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    router.push("/login");
    return;
  }

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("Erro ao buscar pessoas");

    const data = await res.json();

    const pessoasConvertidas: Pessoa[] = data.map((u: any) => {
      // Tratamento do caminho da imagem
      let fotoFinal = "/default-avatar.png";

      if (u.image_path) {
        const imgPath = u.image_path.startsWith("/")
          ? u.image_path.slice(1) // remove a barra inicial
          : u.image_path;

        fotoFinal = `${process.env.NEXT_PUBLIC_API_URL}/${imgPath}`;
      }

      return {
        id: u.id,
        nome: u.name,
        foto: fotoFinal,
      };
    });

    setPessoas(pessoasConvertidas);
  } catch (err: any) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};


  const handleCadastrar = async (nome: string, fotoFile: File | null) => {
    const token = localStorage.getItem("token");
    if (!fotoFile) {
      alert("Selecione uma imagem válida.");
      return;
    }

    const formData = new FormData();
    formData.append("name", nome);
    formData.append("image_file", fotoFile);
    formData.append("cellphone", "999999999");
    formData.append("email", `${Date.now()}@teste.com`);
    formData.append("position", "Analista");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        const error = await res.text();
        console.error("Erro no cadastro:", error);
        throw new Error("Erro ao cadastrar pessoa");
      }

      fetchPessoas();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleEditar = async (id: number, nome: string, foto: string) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: nome, image_url: foto }),
      });
      if (!res.ok) throw new Error("Erro ao atualizar pessoa");
      fetchPessoas();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleExcluir = async (id: number) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Erro ao excluir pessoa");
      fetchPessoas();
    } catch (err: any) {
      alert(err.message);
    }
  };

  useEffect(() => {
    fetchPessoas();
  }, []);

  return (
    <main className="flex min-h-screen w-screen">
      <NavBar />
      <div className="flex flex-col flex-1 p-8">
        <div className="flex justify-between mb-4">
          <input
            type="text"
            placeholder="Buscar Pessoa"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-1/5 border rounded px-1 py-2 text-sm bg-gray-100"
          />
          <button
            onClick={() => setModalCadastroOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
          >
            <PlusIcon className="w-4 h-4" />
            Cadastrar
          </button>
        </div>
        {loading && <p>Carregando...</p>}
        {error && <p className="text-red-600">{error}</p>}
        {!loading && !error && (
          <>
            <Table
              pessoas={pessoasVisiveis}
              onEditar={(id) => {
                const pessoa = pessoas.find((p) => p.id === id);
                if (pessoa) setModalEditarOpen(pessoa);
              }}
              onExcluir={(id) => {
                const pessoa = pessoas.find((p) => p.id === id);
                if (pessoa) setModalExcluirOpen(pessoa);
              }}
            />
            <div className="flex justify-end gap-2 mt-2">
              <button
                disabled={pagina === 0}
                onClick={() => setPagina((p) => Math.max(0, p - 1))}
                className="border px-2 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
              >
                {"<"}
              </button>
              <button
                disabled={pagina >= totalPaginas - 1}
                onClick={() => setPagina((p) => p + 1)}
                className="border px-2 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
              >
                {">"}
              </button>
            </div>
          </>
        )}
      </div>

      {/* Modal Cadastrar */}
      <Modal open={modalCadastroOpen} onClose={() => setModalCadastroOpen(false)}>
        <h2 className="text-lg font-semibold mb-2">Cadastrar Pessoa</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.currentTarget;
            const nome = (form.elements.namedItem("nome") as HTMLInputElement).value;
            if (!fotoFile) return alert("Selecione uma imagem.");
            handleCadastrar(nome, fotoFile);
            setModalCadastroOpen(false);
          }}
          className="space-y-3"
        >
          <input
            name="nome"
            placeholder="Nome"
            className="border w-full px-2 py-1 rounded"
            required
          />
          <input
            name="foto"
            type="file"
            accept="image/*"
            className="border w-full px-2 py-1 rounded"
            onChange={(e) => setFotoFile(e.target.files?.[0] || null)}
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Salvar
          </button>
        </form>
      </Modal>

      {/* Modal Editar */}
      <Modal open={!!modalEditarOpen} onClose={() => setModalEditarOpen(null)}>
        <h2 className="text-lg font-semibold mb-2">Editar Pessoa</h2>
        {modalEditarOpen && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.currentTarget;
              const nome = (form.elements.namedItem("nome") as HTMLInputElement).value;
              const foto = (form.elements.namedItem("foto") as HTMLInputElement).value;
              handleEditar(modalEditarOpen.id, nome, foto);
              setModalEditarOpen(null);
            }}
            className="space-y-3"
          >
            <input
              name="nome"
              defaultValue={modalEditarOpen.nome}
              placeholder="Nome"
              className="border w-full px-2 py-1 rounded"
              required
            />
            <input
              name="foto"
              defaultValue={modalEditarOpen.foto}
              placeholder="URL da Foto"
              className="border w-full px-2 py-1 rounded"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Salvar
            </button>
          </form>
        )}
      </Modal>

      {/* Modal Excluir */}
      <Modal open={!!modalExcluirOpen} onClose={() => setModalExcluirOpen(null)}>
        {modalExcluirOpen && (
          <div className="space-y-4">
            <p>
              Tem certeza que deseja excluir{" "}
              <strong>{modalExcluirOpen.nome}</strong>?
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  handleExcluir(modalExcluirOpen.id);
                  setModalExcluirOpen(null);
                }}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                Sim, excluir
              </button>
              <button
                onClick={() => setModalExcluirOpen(null)}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </Modal>
    </main>
  );
}
