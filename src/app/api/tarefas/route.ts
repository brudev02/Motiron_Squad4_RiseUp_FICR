import { rotasDaColecao } from "@/lib/dashboard/crud";
import { recursoTarefas } from "@/lib/dashboard/recursos";

const rotas = rotasDaColecao(recursoTarefas);

export const GET = rotas.GET;
export const POST = rotas.POST;
