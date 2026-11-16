# CEMEF — Centro de Memória da FAETEC

Site institucional do Centro de Memória da Fundação de Apoio à Escola Técnica do Estado do Rio de Janeiro (CEMEF/FAETEC): museu virtual, história, acervo, conservação, pesquisa, eventos, publicações e ações educativas.

Endereço previsto: https://valantien.github.io/cemef/

## Tecnologia

- [Astro](https://astro.build): site estático, sem servidor.
- Estilo baseado no design system AGENTIC, com destaque azul FAETEC (`#006CA8`) e fonte Rubik, hospedada no próprio site.
- Acessibilidade: widget VLibras e respeito à preferência "reduzir movimento".

## Rodar no computador

Requer Node.js 22.23.4 ou mais novo.

```bash
npm install
npm run dev      # abre em http://localhost:4321/cemef/
```

Para gerar a versão final: `npm run build` (saída em `dist/`) e `npm run preview` para conferir.

## Onde mexer

| O que | Onde |
|---|---|
| Páginas e textos | `src/pages/` |
| Menu, e-mail, endereço e redes sociais | `src/nav.ts` |
| Cores, tamanhos e espaçamentos | `src/styles/cemef.css` |
| Componentes reutilizáveis | `src/components/` |
| Imagens | `src/assets/` |

## Publicação

O site é publicado no GitHub Pages pelo GitHub Actions (`.github/workflows/deploy.yml`) a cada envio para a branch `main`.
Para isso, o Pages precisa estar com a origem "GitHub Actions" (Settings > Pages).

## Licenças

Fonte Rubik sob a SIL Open Font License (`src/fonts/RUBIK-OFL.txt`).
