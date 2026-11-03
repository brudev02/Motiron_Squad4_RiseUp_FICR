import { rotasDaColecao } from "@/lib/dashboard/crud";
import { recursoUnidades } from "@/lib/dashboard/recursos";

const rotas = rotasDaColecao(recursoUnidades);

export const GET = rotas.GET;
export const POST = rotas.POST;
