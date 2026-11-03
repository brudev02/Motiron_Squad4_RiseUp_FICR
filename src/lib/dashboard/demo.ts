import { prisma } from "@/lib/prisma";
import { erroGeral } from "@/lib/api";
import { registrarAtividade } from "./atividades";
import { hojeISO, paraDataUTC, somarDias } from "./datas";

// Dados de exemplo OPCIONAIS. Só são criados quando a pessoa clica em
// "Carregar dados de exemplo" em Configurações. Ficam marcados com demo=true
// (selo "Exemplo" nas tabelas) e podem ser removidos de uma vez.

const UNIDADES = [
  { nome: "Unidade Recife", responsavel: "Ana Silva", cidade: "Recife - PE", situacao: "Ativa" },
  { nome: "Unidade Olinda", responsavel: "Carlos Souza", cidade: "Olinda - PE", situacao: "Ativa" },
  { nome: "Unidade Paulista", responsavel: "Maria Santos", cidade: "Paulista - PE", situacao: "Inativa" },
  { nome: "Unidade Jaboatão", responsavel: "Pedro Lima", cidade: "Jaboatão - PE", situacao: "Ativa" },
] as const;

// unidade = índice em UNIDADES; dias = vencimento em relação a hoje
const DOCUMENTOS = [
  { nome: "Alvará de funcionamento", unidade: 0, responsavel: "Ana Silva", dias: 12, emAnalise: false },
  { nome: "Licença ambiental de operação", unidade: 1, responsavel: "Carlos Souza", dias: 95, emAnalise: false },
  { nome: "Certificado do Corpo de Bombeiros", unidade: 0, responsavel: "Ana Silva", dias: -8, emAnalise: false },
  { nome: "Contrato de locação do imóvel", unidade: 3, responsavel: "Pedro Lima", dias: 240, emAnalise: false },
  { nome: "Licença sanitária", unidade: 1, responsavel: "Carlos Souza", dias: 24, emAnalise: false },
  { nome: "Certidão de regularidade fiscal", unidade: 2, responsavel: "Maria Santos", dias: 60, emAnalise: true },
  { nome: "Seguro patrimonial", unidade: 3, responsavel: "Pedro Lima", dias: -2, emAnalise: false },
  { nome: "Licença de publicidade", unidade: 0, responsavel: "Ana Silva", dias: 180, emAnalise: false },
] as const;

const TAREFAS = [
  { titulo: "Enviar relatório trimestral", responsavel: "Ana Silva", dias: -150, prioridade: "Média", status: "Concluída" },
  { titulo: "Renovar contrato de limpeza", responsavel: "Pedro Lima", dias: -128, prioridade: "Baixa", status: "Concluída" },
  { titulo: "Vistoria elétrica anual", responsavel: "Carlos Souza", dias: -100, prioridade: "Alta", status: "Concluída" },
  { titulo: "Atualizar cadastro de fornecedores", responsavel: "Maria Santos", dias: -92, prioridade: "Média", status: "Concluída" },
  { titulo: "Treinamento de brigada de incêndio", responsavel: "Ana Silva", dias: -66, prioridade: "Alta", status: "Concluída" },
  { titulo: "Revisar apólices de seguro", responsavel: "Pedro Lima", dias: -40, prioridade: "Média", status: "Concluída" },
  { titulo: "Organizar arquivo físico", responsavel: "Maria Santos", dias: -35, prioridade: "Baixa", status: "Concluída" },
  { titulo: "Protocolar renovação de licença", responsavel: "Carlos Souza", dias: -18, prioridade: "Alta", status: "Concluída" },
  { titulo: "Atualizar documentos da Unidade Olinda", responsavel: "Carlos Souza", dias: -3, prioridade: "Alta", status: "Pendente" },
  { titulo: "Revisar contratos de fornecedores", responsavel: "Pedro Lima", dias: 3, prioridade: "Média", status: "Pendente" },
  { titulo: "Emitir certidões negativas", responsavel: "Maria Santos", dias: 7, prioridade: "Média", status: "Em andamento" },
  { titulo: "Renovar alvará de funcionamento", responsavel: "Ana Silva", dias: 10, prioridade: "Alta", status: "Em andamento" },
  { titulo: "Agendar vistoria sanitária", responsavel: "Carlos Souza", dias: 20, prioridade: "Baixa", status: "Pendente" },
] as const;

export async function carregarDadosExemplo(usuarioId: string): Promise<void> {
  const jaExiste = await prisma.unidade.findFirst({
    where: { usuarioId, demo: true },
    select: { id: true },
  });
  if (jaExiste) throw erroGeral(409, "Os dados de exemplo já foram carregados.");

  const hoje = hojeISO();
  const data = (dias: number) => paraDataUTC(somarDias(hoje, dias));

  await prisma.$transaction(async (tx) => {
    const ids: string[] = [];

    for (const u of UNIDADES) {
      const criada = await tx.unidade.create({
        data: { ...u, usuarioId, demo: true },
        select: { id: true },
      });
      ids.push(criada.id);
    }

    await tx.documento.createMany({
      data: DOCUMENTOS.map((d) => ({
        nome: d.nome,
        responsavel: d.responsavel,
        emAnalise: d.emAnalise,
        vencimento: data(d.dias),
        unidadeId: ids[d.unidade],
        usuarioId,
        demo: true,
      })),
    });

    await tx.tarefa.createMany({
      data: TAREFAS.map((t) => ({
        titulo: t.titulo,
        responsavel: t.responsavel,
        prioridade: t.prioridade,
        status: t.status,
        prazo: data(t.dias),
        usuarioId,
        demo: true,
      })),
    });
  });

  await registrarAtividade(usuarioId, "sistema", "Dados de exemplo carregados");
}

export async function removerDadosExemplo(usuarioId: string): Promise<void> {
  // Documentos primeiro; unidades de exemplo depois. Registros criados pela
  // própria pessoa nunca são apagados (demo=false).
  await prisma.$transaction([
    prisma.documento.deleteMany({ where: { usuarioId, demo: true } }),
    prisma.tarefa.deleteMany({ where: { usuarioId, demo: true } }),
    prisma.unidade.deleteMany({ where: { usuarioId, demo: true } }),
  ]);

  await registrarAtividade(usuarioId, "sistema", "Dados de exemplo removidos");
}

/** A conta possui registros de exemplo carregados? (define o botão em Configurações) */
export async function possuiDadosExemplo(usuarioId: string): Promise<boolean> {
  const [unidades, documentos, tarefas] = await Promise.all([
    prisma.unidade.count({ where: { usuarioId, demo: true } }),
    prisma.documento.count({ where: { usuarioId, demo: true } }),
    prisma.tarefa.count({ where: { usuarioId, demo: true } }),
  ]);

  return unidades + documentos + tarefas > 0;
}
