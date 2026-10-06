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
}: InputTextoProps){
    return (
        <div className="flex flex-col gap-2">
            <label htmlFor={nome} className="text-sm text-white">
                {label}
            </label>

            <input
            id={nome}
            name={nome}
            type={tipo}
            placeholder={placeholder}
            required
            className="w-full rounded-xl border border-indigo-300/20 bg-indigo-950/30 px-4 py-3 text-white placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-indigo-400"/>
            
        </div>
    );
}