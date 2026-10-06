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
      className="w-full rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white"
    >
      {texto}
    </button>
  );
}