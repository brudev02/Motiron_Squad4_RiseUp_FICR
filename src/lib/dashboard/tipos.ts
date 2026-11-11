// Tipos e constantes do dashboard. Este arquivo NÃO importa Prisma nem nada
// do servidor: pode ser usado tanto em Server quanto em Client Components.

export const SITUACOES_UNIDADE = ["Ativa", "Inativa"] as const;
export type SituacaoUnidade = (typeof SITUACOES_UNIDADE)[number];

export const SITUACOES_DOCUMENTO = [
  "Vigente",
  "Em análise",
  "A vencer",
  "Vencido",
] as const;
export type SituacaoDocumento = (typeof SITUACOES_DOCUMENTO)[number];

export const PRIORIDADES = ["Baixa", "Média", "Alta"] as const;
export type Prioridade = (typeof PRIORIDADES)[number];

export const STATUS_TAREFA = ["Pendente", "Em andamento", "Concluída"] as const;
export type StatusTarefa = (typeof STATUS_TAREFA)[number];

export const PERFIS = ["empresa", "funcionario"] as const;
export type Perfil = (typeof PERFIS)[number];

/** Documentos que vencem em até X dias aparecem como "A vencer". */
export const JANELA_VENCIMENTO_DIAS = 30;

export type UnidadeDTO = {
  id: string;
  nome: string;
  responsavel: string;
  cidade: string;
  situacao: SituacaoUnidade;
  qtdDocumentos: number;
  demo: boolean;
};

export type DocumentoDTO = {
  id: string;
  nome: string;
  responsavel: string;
  unidadeId: string | null;
  unidadeNome: string | null;
  /** AAAA-MM-DD ou null */
  vencimento: string | null;
  emAnalise: boolean;
  /** Situação já calculada (vencimento + análise). */
  situacao: SituacaoDocumento;
  demo: boolean;

  // Informações do PDF anexado (opcionais).
  arquivoNome?: string | null;
  arquivoChave?: string | null;
  arquivoTipo?: string | null;
};

export type TarefaDTO = {
  id: string;
  titulo: string;
  responsavel: string;
  /** AAAA-MM-DD ou null */
  prazo: string | null;
  prioridade: Prioridade;
  status: StatusTarefa;
  atrasada: boolean;
  demo: boolean;
};

export type TipoAtividade = "unidade" | "documento" | "tarefa" | "sistema";

export type AtividadeDTO = {
  id: string;
  tipo: TipoAtividade;
  descricao: string;
  /** Texto relativo já pronto, ex.: "há 2 h". */
  quando: string;
};

export type PontoAtividade = {
  rotulo: string;
  concluidas: number;
  emAberto: number;
};

export type FatiaDistribuicao = {
  rotulo: SituacaoDocumento;
  valor: number;
};

export type Resumo = {
  totais: {
    unidades: number;
    unidadesAtivas: number;
    documentos: number;
    documentosAtivos: number;
    aVencer: number;
    vencidos: number;
    tarefasPendentes: number;
    tarefasAtrasadas: number;
  };
  atividade6m: PontoAtividade[];
  atividadeAno: PontoAtividade[];
  distribuicao: FatiaDistribuicao[];
  atencao: DocumentoDTO[];
  recentes: AtividadeDTO[];
};

export type Alerta = {
  id: string;
  tipo: "documento" | "tarefa";
  titulo: string;
  detalhe: string;
  gravidade: "perigo" | "aviso";
  href: string;
};

export type UsuarioSessao = {
  id: string;
  nome: string;
  email: string;
  perfil: Perfil;
  criadoEm: string;
};
