import Link from "next/link";
import { Logo } from "@/components/brand/logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex flex-col justify-center px-6 py-12 sm:px-12">
        <div className="mx-auto w-full max-w-sm">
          <Logo className="mb-8" />
          {children}
        </div>
      </div>
      <div className="relative hidden gradient-brand lg:block">
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="relative flex h-full flex-col justify-center p-12 text-white">
          <blockquote className="max-w-md text-2xl font-semibold leading-snug">
            « AKADIA a divisé par trois le temps de production de nos formations,
            tout en doublant l&apos;engagement. »
          </blockquote>
          <p className="mt-6 text-white/80">
            Sophie Marchand — Responsable Formation, Cabinet Delvaux
          </p>
          <Link href="/" className="mt-10 text-sm text-white/70 hover:text-white">
            ← Retour au site
          </Link>
        </div>
      </div>
    </div>
  );
}
