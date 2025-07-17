import './globals.css';
import { ReactNode } from 'react';

export const metadata = {
  title: 'Tranca Facial',
  description: 'Gerenciamento de Laboratório com Reconhecimento Facial',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
