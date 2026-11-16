// Mapa do site (PRD §5). Rotas ainda não construídas ficam marcadas com pronto: false.
export const paginas = [
  { href: 'historia/', rotulo: 'História', pronto: true },
  { href: 'museu-virtual/', rotulo: 'Museu Virtual', pronto: true },
  { href: 'acervo/', rotulo: 'Acervo', pronto: true },
  { href: 'conservacao/', rotulo: 'Conservação', pronto: true },
  { href: 'pesquisa/', rotulo: 'Pesquisa', pronto: true },
  { href: 'eventos/', rotulo: 'Eventos', pronto: true },
  { href: 'publicacoes/', rotulo: 'Publicações', pronto: true },
  { href: 'acoes-educativas/', rotulo: 'Ações Educativas', pronto: true },
  { href: 'centros-de-memoria/', rotulo: 'Centros de Memória', pronto: true },
  { href: 'contato/', rotulo: 'Contato', pronto: true },
];

export const contato = {
  email: 'info@cemef.faetec.rj.gov.br',
  endereco: ['Rua Clarimundo de Melo, nº 847', 'Quintino Bocaiúva, Rio de Janeiro', 'CEP 21311-280'],
  mapa: 'https://www.openstreetmap.org/search?query=' + encodeURIComponent('Rua Clarimundo de Melo 847, Quintino Bocaiúva, Rio de Janeiro'),
};

export const redes = [
  { nome: 'Instagram', conta: '@cemef.faetec', href: 'https://www.instagram.com/cemef.faetec' },
  { nome: 'Facebook', conta: '/cemef.faetec', href: 'https://www.facebook.com/cemef.faetec' },
  { nome: 'YouTube', conta: 'Centro de Memória da FAETEC', href: 'https://www.youtube.com/@CENTRODEMEM%C3%93RIADAFAETEC' },
];
