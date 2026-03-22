import { ReactNode } from "react";

export function TaskFormCard({
  title,
  description,
  children
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-[2rem] border border-ink/10 bg-white/75 p-6 shadow-sm backdrop-blur">
      <div className="mb-6">
        <h1 className="text-3xl font-black tracking-tight text-ink">{title}</h1>
        <p className="mt-2 max-w-2xl text-sm text-ink/70">{description}</p>
      </div>
      {children}
    </section>
  );
}
