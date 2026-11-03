import { rotasDoItem } from "@/lib/dashboard/crud";
import { recursoTarefas } from "@/lib/dashboard/recursos";

const rotas = rotasDoItem(recursoTarefas);

export const PUT = rotas.PUT;
export const DELETE = rotas.DELETE;
