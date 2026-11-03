import type { NomeIcone } from "@/components/ui/Icones";

// Navegação do dashboard. É a única fonte dos nomes das seções: a sidebar,
// o cabeçalho e a prévia da landing page (MockupDashboard) usam esta lista.

export type ItemMenu = {
  href: string;
  nome: string;
  icone: NomeIcone;
  grupo: "workspace" | "administracao";
  /** A seção tem lista pesquisável (campo de busca do cabeçalho). */
  busca?: boolean;
};

export const ITENS_MENU: ItemMenu[] = [
  { href: "/dashboard", nome: "Visão geral", icone: "grid", grupo: "workspace" },
  { href: "/dashboard/unidades", nome: "Unidades", icone: "predio", grupo: "workspace", busca: true },
  { href: "/dashboard/documentos", nome: "Documentos", icone: "documento", grupo: "workspace", busca: true },
  { href: "/dashboard/tarefas", nome: "Tarefas", icone: "tarefas", grupo: "workspace", busca: true },
  { href: "/dashboard/relatorios", nome: "Relatórios", icone: "grafico", grupo: "workspace" },
  { href: "/dashboard/usuarios", nome: "Usuários", icone: "equipe", grupo: "administracao" },
  { href: "/dashboard/configuracoes", nome: "Configurações", icone: "config", grupo: "administracao" },
];

export const GRUPOS_MENU = [
  { id: "workspace", titulo: "Workspace" },
  { id: "administracao", titulo: "Administração" },
] as const;

/** Item ativo para um caminho (o mais específico vence). */
export function itemAtivo(caminho: string): ItemMenu {
  const correspondentes = ITENS_MENU.filter(
    (item) => caminho === item.href || caminho.startsWith(`${item.href}/`)
  );

  return (
    correspondentes.sort((a, b) => b.href.length - a.href.length)[0] ??
    ITENS_MENU[0]
  );
}

export function iniciais(nome: string): string {
  const partes = nome.trim().split(/\s+/).filter(Boolean);
  if (partes.length === 0) return "?";
  if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase();
  return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
}
