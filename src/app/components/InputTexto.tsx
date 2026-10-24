interface InputTextoProps {
  label: string;
  nome: string;
  placeholder: string;
  tipo?: "text" | "email";
}

export default function InputTexto({
    label,
    nome,
    placeholder,
    tipo = "text",
}: InputTextoProps) {
    return (
      <div className="flex flex-col gap-2">
        <label htmlFor={nome} className="text-xs text-white">
          {label}
        </label>

        <input
          id={nome}
          name={nome}
          type={tipo}
          placeholder={placeholder}
          required
          className="h-10 w-full rounded-xl bg-campo px-3 text-xs text-escuro shadow-[0_4px_6px_rgba(0,0,0,0.35)] placeholder:text-escuro/60 outline-none focus-visible:ring-2 focus-visible:ring-destaque"
        />
      </div>
    );
}