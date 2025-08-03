"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${apiUrl}/api/admin/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          username,
          password,
        }),
      });

      if (!res.ok) {
        throw new Error("Credenciais inválidas");
      }

      const data = await res.json();
      localStorage.setItem("token", data.access_token);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <main className="flex min-h-screen">
      {/* Coluna esquerda */}
      <section className="w-full md:w-1/2 flex flex-col justify-center items-center bg-white p-8">
        <div className="w-[434px] h-[582px] flex flex-col gap-8">
          {/* Logo e Título */}
          <div className="flex flex-col justify-center items-center gap-y-2">
            <div className="flex justify-center">
              <Image
                src="/Logo.png"
                alt="Logo do sistema"
                width={66}
                height={66}
              />
            </div>
            <div className="flex justify-center">
              <h1 className="text-xl font-bold text-gray-800">
                TRANCA COM RECONHECIMENTO FACIAL
              </h1>
            </div>
          </div>
          {/* Formulário */}
          <div className="flex flex-col justify-center items-center space-y-4">
            <h1 className="font-semibold">LOGIN</h1>
            <h2 className="font-normal opacity-50">
              Enter the platform for laboratory management.
            </h2>
            <form onSubmit={handleLogin} className="w-full space-y-5">
              {/* Username */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full rounded bg-[#004F921A] pl-10 pr-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5.121 17.804A9.969 9.969 0 0112 15c2.157 0 4.153.684 5.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </span>
              </div>
              {/* Password */}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded bg-[#004F921A] pl-10 pr-10 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 11c1.657 0 3-1.343 3-3S13.657 5 12 5 9 6.343 9 8s1.343 3 3 3zM5.121 17.804A9.969 9.969 0 0112 15c2.157 0 4.153.684 5.879 1.804"
                    />
                  </svg>
                </span>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
              {/* Erro */}
              {error && (
                <p className="text-red-600 text-sm">{error}</p>
              )}
              {/* Forgot password */}
              <div className="flex justify-end">
                <a href="#" className="text-sm text-gray-500 hover:underline">
                  Forgot your password?
                </a>
              </div>
              {/* Botão */}
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="w-1/2 py-3 px-3 rounded text-white font-semibold hover:from-blue-600 hover:to-blue-800 transition"
                  style={{ background: "var(--color-button-bg)" }}
                >
                  Login Now
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
      {/* Coluna direita */}
      <section className="hidden md:flex w-1/2 items-center justify-center bg-bg-blue relative">
        <div className="overflow-hidden mix-blend-multiply z-10">
          <Image
            src="/background_patter.png"
            alt="Patter"
            fill
            className="object-cover absolute top-0 left-0 mix-blend-multiply"
          />
        </div>
        <div className="overflow-hidden mix-blend z-20">
          <Image
            src="/Man.png"
            alt="Homem no tablet"
            width="500"
            height="500"
          />
        </div>
      </section>
    </main>
  );
}
