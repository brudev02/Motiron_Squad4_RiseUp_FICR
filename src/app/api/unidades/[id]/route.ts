import { rotasDoItem } from "@/lib/dashboard/crud";
import { recursoUnidades } from "@/lib/dashboard/recursos";

const rotas = rotasDoItem(recursoUnidades);

export const PUT = rotas.PUT;
export const DELETE = rotas.DELETE;
