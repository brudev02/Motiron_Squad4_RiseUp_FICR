import { rotasDoItem } from "@/lib/dashboard/crud";
import { recursoDocumentos } from "@/lib/dashboard/recursos";

const rotas = rotasDoItem(recursoDocumentos);

export const PUT = rotas.PUT;
export const DELETE = rotas.DELETE;
