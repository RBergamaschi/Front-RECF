"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChartPieIcon,
  UserIcon,
  ArrowLeftOnRectangleIcon,
} from "@heroicons/react/24/outline";

export default function NavBar() {
  const pathname = usePathname();

  return (
    <aside className="flex flex-col min-h-screen w-[280px] bg-bg-blue border-r border-[#003f75]">
      {/* Logo */}
      <div className="flex flex-col items-center mt-6">
        <Image src="/Logo-Branca.png" alt="logo" width={50} height={50} />
        <div className="w-[180px] h-px bg-white/10 my-4" />
      </div>

      {/* Navegação */}
      <nav className="flex flex-col w-full mt-8">
        <Link
          href="/dashboard"
          className={`flex justify-center gap-3 px-6 py-3 text-sm transition-colors ${
            pathname === "/dashboard"
              ? "text-white bg-white/10 rounded-r-lg"
              : "text-white/60 hover:text-white"
          }`}
        >
          <ChartPieIcon className="h-5 w-5" />
          Dashboard
        </Link>
        <Link
          href="/pessoas"
          className={`flex justify-center gap-3 px-6 py-3 text-sm transition-colors ${
            pathname === "/pessoas"
              ? "text-white bg-white/10 rounded-r-lg"
              : "text-white/60 hover:text-white"
          }`}
        >
          <UserIcon className="h-5 w-5" />
          Cadastros
        </Link>
      </nav>

      <div className="flex-grow" />

      {/* Sair */}
      <button
        className="flex justify-center gap-2 px-6 py-3 mb-6 text-white/70 hover:text-white text-sm"
        onClick={() => {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }}
      >
        <ArrowLeftOnRectangleIcon className="h-5 w-5" />
        Sair
      </button>
    </aside>
  );
}
