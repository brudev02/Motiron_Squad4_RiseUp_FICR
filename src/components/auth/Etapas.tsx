type Props = {
  atual: 1 | 2 | 3;
};

// Indicador das três etapas de acesso:
//   1 - Criação de Conta (escolha do perfil)  -> /cadastro
//   2 - Cadastro (dados da conta)             -> /cadastro/[perfil]
//   3 - Entrada no sistema (login)            -> /login
// A etapa atual fica em destaque; as já percorridas ficam em tom mais
// suave e as próximas, escuras. Quem já tem conta cai direto na etapa 3.
export function Etapas({ atual }: Props) {
  return (
    <div
      className="flex items-center justify-center"
      role="img"
      aria-label={`Etapa ${atual} de 3`}
    >
      {[1, 2, 3].map((numero, posicao) => (
        <div key={numero} className="flex items-center">
          {posicao > 0 && <span className="h-px w-10 bg-white/60" />}

          <span
            aria-current={numero === atual ? "step" : undefined}
            className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold text-white ${
              numero === atual
                ? "bg-destaque"
                : numero < atual
                  ? "bg-destaque/50"
                  : "bg-black"
            }`}
          >
            {numero}
          </span>
        </div>
      ))}
    </div>
  );
}
