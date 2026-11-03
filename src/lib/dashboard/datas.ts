// Funções de data usadas pelo dashboard. Todas trabalham com strings
// "AAAA-MM-DD" (datas sem horário) para evitar surpresas de fuso horário.

export const FUSO = "America/Sao_Paulo";

const MESES_ABREV = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];

/** Data de hoje (AAAA-MM-DD) no fuso de Brasília. */
export function hojeISO(agora: Date = new Date()): string {
  const partes = new Intl.DateTimeFormat("en-CA", {
    timeZone: FUSO,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(agora);

  const pegar = (tipo: string) =>
    partes.find((parte) => parte.type === tipo)?.value ?? "";

  return `${pegar("year")}-${pegar("month")}-${pegar("day")}`;
}

/** Hora cheia (0-23) no fuso de Brasília. */
export function horaAtual(agora: Date = new Date()): number {
  const hora = new Intl.DateTimeFormat("en-GB", {
    timeZone: FUSO,
    hour: "2-digit",
    hour12: false,
  }).format(agora);

  return Number(hora) % 24;
}

/** Verifica formato e existência real do dia (rejeita 2026-02-31). */
export function dataValida(iso: string): boolean {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return false;

  const [ano, mes, dia] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const data = new Date(Date.UTC(ano, mes - 1, dia));

  return (
    data.getUTCFullYear() === ano &&
    data.getUTCMonth() === mes - 1 &&
    data.getUTCDate() === dia
  );
}

/** AAAA-MM-DD -> Date à meia-noite UTC (como é gravado no banco). */
export function paraDataUTC(iso: string): Date {
  return new Date(`${iso}T00:00:00.000Z`);
}

/** Date -> AAAA-MM-DD (UTC). */
export function deDataUTC(data: Date): string {
  return data.toISOString().slice(0, 10);
}

function emDias(iso: string): number {
  const [ano, mes, dia] = iso.split("-").map(Number);
  return Date.UTC(ano, mes - 1, dia) / 86_400_000;
}

/** Quantidade de dias de `de` até `ate` (negativo se `ate` for anterior). */
export function diasEntre(de: string, ate: string): number {
  return Math.round(emDias(ate) - emDias(de));
}

export function somarDias(iso: string, dias: number): string {
  return new Date((emDias(iso) + dias) * 86_400_000).toISOString().slice(0, 10);
}

/** AAAA-MM-DD -> DD/MM/AAAA */
export function formatarData(iso: string | null): string {
  if (!iso) return "—";
  const [ano, mes, dia] = iso.split("-");
  return `${dia}/${mes}/${ano}`;
}

/** Chaves "AAAA-MM" dos últimos `quantidade` meses, terminando no mês de `hoje`. */
export function ultimosMeses(quantidade: number, hoje: string): string[] {
  const [ano, mes] = hoje.split("-").map(Number);
  const chaves: string[] = [];

  for (let i = quantidade - 1; i >= 0; i--) {
    const indice = ano * 12 + (mes - 1) - i;
    const a = Math.floor(indice / 12);
    const m = (indice % 12) + 1;
    chaves.push(`${a}-${String(m).padStart(2, "0")}`);
  }

  return chaves;
}

/** Chaves "AAAA-MM" de janeiro a dezembro do ano de `hoje`. */
export function mesesDoAno(hoje: string): string[] {
  const ano = hoje.slice(0, 4);
  return Array.from({ length: 12 }, (_, i) => `${ano}-${String(i + 1).padStart(2, "0")}`);
}

/** "2026-05" -> "Mai" */
export function rotuloMes(chave: string): string {
  return MESES_ABREV[Number(chave.slice(5, 7)) - 1] ?? chave;
}

/** Texto relativo curto: "agora", "há 5 min", "há 3 h", "há 2 dias", "12/10/2026". */
export function tempoRelativo(data: Date, agora: Date = new Date()): string {
  const segundos = Math.max(0, Math.round((agora.getTime() - data.getTime()) / 1000));

  if (segundos < 60) return "agora";
  if (segundos < 3600) return `há ${Math.floor(segundos / 60)} min`;
  if (segundos < 86_400) return `há ${Math.floor(segundos / 3600)} h`;

  const dias = Math.floor(segundos / 86_400);
  if (dias < 7) return `há ${dias} ${dias === 1 ? "dia" : "dias"}`;

  return formatarData(hojeISO(data));
}
