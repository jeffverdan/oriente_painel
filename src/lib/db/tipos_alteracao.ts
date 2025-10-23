import { supabase } from "@/lib/supabaseClient";
import { TipoAlteracao } from "@/types/processo";

/**
 * 🔹 Remove do banco os tipos de alteração antigos (que não existem mais no array novo)
 */
export async function removerTiposAlteracaoAntigos(
    arrayAntigo: TipoAlteracao[],
    arrayNovo: TipoAlteracao[]
) {
    // Filtra os IDs que não estão mais presentes no array novo
    const idsParaExcluir = arrayAntigo
        .filter(
            (antigo) =>
                !arrayNovo.some(
                    (novo) =>
                        novo.id_tabela === antigo.id_tabela || novo.id === antigo.id_tabela
                )
        )
        .map((item) => item.id_tabela)
        .filter((id): id is number => !!id);

    if (idsParaExcluir.length === 0) {
        console.log("Nenhum tipo de alteração antigo para excluir 👌");
        return;
    }

    console.log("🗑️ IDs para excluir:", idsParaExcluir);

    const { error } = await supabase
        .from("processos_tipos_alteracao")
        .delete()
        .in("id", idsParaExcluir);

    if (error) throw new Error(error.message);

    console.log(`✅ ${idsParaExcluir.length} registros excluídos.`);
}

/**
 * 🔹 Insere no banco os novos tipos de alteração (que ainda não existiam)
 */
export async function inserirTiposAlteracaoNovos(
    arrayAntigo: TipoAlteracao[],
    arrayNovo: TipoAlteracao[],
    processoId: number
) {
    // Filtra os itens novos
    const novos = arrayNovo.filter(
        (novo) =>
            !arrayAntigo.some(
                (antigo) =>
                    antigo.id_tabela === novo.id_tabela ||
                    antigo.id_tabela === novo.id // evita duplicidades
            )
    );

    if (novos.length === 0) {
        console.log("Nenhum novo tipo de alteração para inserir 👌");
        return;
    }

    // Mapeia para o formato da tabela pivot
    const registrosParaInserir = novos.map((item) => ({
        processo_id: processoId,
        tipo_alteracao_id: item.id,
    }));

    console.log("➕ Novos registros:", registrosParaInserir);

    const { error } = await supabase
        .from("processos_tipos_alteracao")
        .insert(registrosParaInserir);

    if (error) throw new Error(error.message);

    console.log(`✅ ${registrosParaInserir.length} novos registros inseridos.`);
}

/**
 * 🔹 Função utilitária para sincronizar tipos de alteração (remove + insere)
 */
export async function syncTiposAlteracao(
    //   arrayAntigo: TipoAlteracao[],
    arrayNovo: TipoAlteracao[],
    processoId: number
) {

    const { data: oldTiposAlteracao } = await supabase
        .from('processos_tipos_alteracao')
        .select('*')
        .eq('processo_id', processoId);

    const arrayAntigo = (oldTiposAlteracao?.map(ota => ({
        id: ota.tipo_alteracao_id,
        id_tabela: ota.id,
    })) || []) as TipoAlteracao[];

    await removerTiposAlteracaoAntigos(arrayAntigo, arrayNovo);
    await inserirTiposAlteracaoNovos(arrayAntigo, arrayNovo, processoId);
}
