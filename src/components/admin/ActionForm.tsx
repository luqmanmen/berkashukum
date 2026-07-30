"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect-error";

export default function ActionForm({
  action,
  children,
  successUrl,
  className
}: {
  action: (formData: FormData) => Promise<any>;
  children: React.ReactNode;
  successUrl?: string;
  className?: string;
}) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");

    const formData = new FormData(e.currentTarget);
    try {
      const res = await action(formData);
      if (res?.error) {
        setStatus("error");
        setErrorMessage(res.error);
        setTimeout(() => setStatus("idle"), 5000);
      } else {
        setStatus("success");
        setTimeout(() => {
          if (successUrl) {
            router.push(successUrl);
            router.refresh();
          } else {
            setStatus("idle");
          }
        }, 2000);
      }
    } catch (err: any) {
      if (isRedirectError(err) || err?.message?.includes('NEXT_REDIRECT') || err?.digest?.includes('NEXT_REDIRECT')) {
        throw err;
      }
      console.error(err);
      setStatus("error");
      setErrorMessage(err.message || "Unknown error");
      setTimeout(() => setStatus("idle"), 5000);
    }
  };

  return (
    <>
      {status !== "idle" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-all duration-300">
          <div className="bg-white p-8 rounded-2xl shadow-2xl flex flex-col items-center transform scale-100 animate-in fade-in zoom-in-75 duration-300">
            {status === "loading" && (
              <>
                <div className="w-16 h-16 border-4 border-gray-100 border-t-navy-dark rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-600 font-medium text-sm">Menyimpan data...</p>
              </>
            )}

            {status === "success" && (
              <>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-3">
                  <svg className="w-8 h-8 text-green-500 animate-[pulse_0.5s_ease-in-out]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">Berhasil!</h3>
                <p className="text-gray-500 text-sm">Data berhasil disimpan.</p>
              </>
            )}

            {status === "error" && (
              <>
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-3">
                  <svg className="w-8 h-8 text-red-500 animate-[bounce_0.5s_ease-in-out]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">Gagal</h3>
                <p className="text-gray-500 text-sm text-center">Terjadi kesalahan. Silakan coba lagi.</p>
                {errorMessage && (
                  <div className="mt-3 p-2 bg-red-50 border border-red-100 rounded text-xs text-red-600 max-w-[280px] break-words text-center">
                    {errorMessage}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className={className}>
        {children}
      </form>
    </>
  );
}
