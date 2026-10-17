interface BotaoExtendidoProps {
  texto: string;
  tipo?: "button" | "submit" | "reset";
}

export default function BotaoExtendido({
  texto,
  tipo = "button",
}: BotaoExtendidoProps) {
  return (
    <button
      type={tipo}
      className="h-10 w-full rounded-full bg-destaque px-10 text-sm font-medium text-white shadow-[0_4px_6px_rgba(0,0,0,0.35)] transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
    >
      {texto}
    </button>
  );
}