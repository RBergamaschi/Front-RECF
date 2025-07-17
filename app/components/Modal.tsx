"use client";

interface Props {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function Modal({ open, onClose, children }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        {children}
        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="text-sm text-gray-600 hover:underline"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
