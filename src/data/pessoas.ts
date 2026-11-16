// Regra P12 (PRD §12.1): o site mostra nomes só da equipe do CEMEF e de autores de livros.
// Demais pessoas aparecem pela função. Se o CEO liberar nomes de convidados públicos
// (palestrantes, autoridades), basta trocar para true.
export const MOSTRAR_NOMES_EXTERNOS = false;

export type Externo = { nome: string; funcao: string };
export const citar = (p: Externo) => (MOSTRAR_NOMES_EXTERNOS ? `${p.nome} (${p.funcao})` : p.funcao);
