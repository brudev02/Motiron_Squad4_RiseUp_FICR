
import { DashboardDocumentsNova } from "@/components/dashboard/DashboardDocumentsNova";
import { listarDocumentos } from "@/lib/dashboard/documentos";
import { listarUnidades } from "@/lib/dashboard/unidades";
import { exigirUsuario } from "@/lib/sessao";

type Props = {
  searchParams: Promise<{
    novo?: string;
  }>;
};

export default async function DocumentosNovaPage({
  searchParams,
}: Props) {
  const usuario = await exigirUsuario();
  const parametros = await searchParams;

  const [documentos, unidades] = await Promise.all([
    listarDocumentos(usuario.id),
    listarUnidades(usuario.id),
  ]);

  return (
    <DashboardDocumentsNova
      documentos={documentos}
      unidades={unidades.map(({ id, nome, situacao }) => ({
        id,
        nome,
        situacao,
      }))}
      abrirNovo={parametros.novo === "1"}
    />
  );
}
