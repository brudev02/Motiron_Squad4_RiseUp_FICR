import { rotasDaColecao } from "@/lib/dashboard/crud";
import { recursoDocumentos } from "@/lib/dashboard/recursos";

const rotas = rotasDaColecao(recursoDocumentos);

export const GET = rotas.GET;
export const POST = rotas.POST;
