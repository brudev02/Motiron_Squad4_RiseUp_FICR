import { DashboardDocuments } from "@/components/dashboard/DashboardDocuments";
import { listarDocumentos } from "@/lib/dashboard/documentos";
import { listarUnidades } from "@/lib/dashboard/unidades";
import { exigirUsuario } from "@/lib/sessao";

export default async function DocumentosPage({
  searchParams,
}: {
  searchParams: Promise<{ novo?: string }>;
}) {
  const usuario = await exigirUsuario();
  const [documentos, unidades, { novo }] = await Promise.all([
    listarDocumentos(usuario.id),
    listarUnidades(usuario.id),
    searchParams,
  ]);

  return (
    <DashboardDocuments
      documentos={documentos}
      unidades={unidades.map(({ id, nome }) => ({ id, nome }))}
      abrirNovo={novo === "1"}
    />
  );
}
