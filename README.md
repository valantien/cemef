# Site do CEMEF — Centro de Memória da FAETEC

Site estático em [Astro](https://astro.build) com o design system AGENTIC (`agentic@1.0.0`).
Planejamento em `PRD.md` e `task_plan.md`; conteúdo de origem em `../docs/base_conhecimento/scrapping/`.

## Rodar no computador

Requer Node.js 22.23.4 ou mais novo.

```bash
npm install
npm run dev      # abre em http://localhost:4321/cemef/
```

`npm run build` gera o site em `dist/`; `npm run preview` serve essa versão final.

## Publicação

Ainda não publicado. Depois da aprovação do CEO, o site vai para `valantien/cemef` e é publicado em
https://valantien.github.io/cemef/ pelo GitHub Actions.
