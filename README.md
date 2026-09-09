# V1 Banda Larga — site novo

Site institucional recriado do zero para a V1 Banda Larga (Santa Rita-PB), em HTML/CSS/JS puro — sem build, sem framework, pronto pra subir no GitHub + Vercel. Agora com **várias páginas** (não é mais tudo numa página só).

## Estrutura

```
v1-bandalarga/
├── index.html            → Início (hero + atalhos + resumo de cada seção)
├── planos.html           → Planos (os 5 planos completos)
├── cobertura.html        → Verificar cobertura + lista de bairros
├── vigia.html            → V1 Vigia (câmeras de segurança)
├── central.html          → Central do Assinante
├── institucional.html    → Sobre a V1
├── css/style.css         → estilo completo do site (compartilhado por todas as páginas)
├── js/main.js            → menu mobile, verificador de cobertura, animações (compartilhado)
├── supabase/schema.sql   → tabela de cobertura pro Supabase
└── README.md
```

**Importante pra quem for editar depois**: o cabeçalho e o rodapé são repetidos em cada arquivo `.html` (é assim que sites estáticos simples funcionam, sem um sistema de "includes"). Se um dia precisar mudar um link do menu ou do rodapé, é preciso repetir a mudança nas 6 páginas. Se isso incomodar no futuro, dá pra migrar pra um framework como Next.js ou Astro — mas pra o tamanho atual do site, manter simples assim é mais fácil de hospedar e editar sem saber programar.

## Páginas e o que tem em cada uma

- **index.html (Início)** — hero com o cartão de "status de sinal" animado, atalhos pras 4 páginas principais, resumo de cobertura, 3 planos em destaque, vantagens da V1, teaser do V1 Vigia
- **planos.html** — os 5 planos completos (Start 100, Plus 400, Flex 500, Premium 1000, Premium Ultra 1000) + dúvidas sobre planos
- **cobertura.html** — o verificador de bairro (ligado ao Supabase) + lista completa dos bairros de Santa Rita-PB
- **vigia.html** — a página do V1 Vigia (câmeras), com "como funciona" em 3 passos
- **central.html** — login, 2ª via de boleto, **desbloqueio automático**, teste de velocidade, indique um amigo, falar com suporte
- **institucional.html** — texto sobre a empresa, valores e presença em Santa Rita-PB

## 1. Antes de publicar — o que você PRECISA revisar

Fiz o site com o conteúdo real que já existe no `v1bandalarga.com.br` (planos, preços, WhatsApp, CNPJ), mas alguns pontos exigem confirmação sua antes de ir ao ar:

- **Link de desbloqueio automático**: hoje ele aponta pra mesma central (`v1bandalarga.sgp.net.br/accounts/central/login`), porque o site atual não tem esse recurso. Se o SGP de vocês já tem uma URL própria de autoatendimento pra desbloqueio, troque o link em `index.html` (procure por `Desbloqueio automático`, aparece 2 vezes: seção Central e rodapé) e em `js/main.js` se necessário.
- **Redes sociais**: os ícones de Facebook/Instagram/YouTube no rodapé estão com `href="#"` — troque pelos links reais dos perfis da V1.
- **FAQ**: as respostas em "Dúvidas frequentes" são um ponto de partida (prazo de instalação, comodato do roteador, formas de pagamento etc.) — confirme se batem com a política atual da empresa e ajuste o texto direto no `index.html`.
- **Cobertura por bairro**: veja o passo 3 abaixo — é a parte mais importante.

## 2. Deploy (GitHub + Vercel)

1. Crie um repositório novo no GitHub e suba esta pasta:
   ```bash
   git init
   git add .
   git commit -m "Site V1 Banda Larga"
   git branch -M main
   git remote add origin <url-do-seu-repositorio>
   git push -u origin main
   ```
2. Entre em [vercel.com](https://vercel.com), clique em **Add New Project**, importe o repositório.
3. Como é um site estático (sem framework), a Vercel detecta sozinha — não precisa configurar build command nem output directory. Clique em **Deploy**.
4. Pronto: a Vercel te dá uma URL `.vercel.app`. Depois é só apontar o domínio `v1bandalarga.com.br` pra ela em **Project Settings > Domains**.

## 3. Configurar o Supabase (verificador de cobertura)

O buscador de cobertura funciona sozinho mesmo sem Supabase (usa uma lista de exemplo dentro do `js/main.js`), mas o ideal é ligar ao banco de verdade:

1. Crie um projeto em [supabase.com](https://supabase.com).
2. Vá em **SQL Editor > New query**, cole o conteúdo de `supabase/schema.sql` e rode. Isso cria a tabela `cobertura_bairros` já com os bairros reais de Santa Rita-PB — todos marcados como `confirmar`.
3. Vá em **Table Editor > cobertura_bairros** e mude o `status` de cada bairro pra `disponivel` (já atende) ou `em_expansao` (ainda não atende), conforme a cobertura real de vocês. Pode adicionar mais bairros/loteamentos à mão.
4. Em **Project Settings > API**, copie a **Project URL** e a chave **anon public**.
5. Abra `js/main.js` e preencha as duas primeiras variáveis:
   ```js
   const SUPABASE_URL = "https://seuprojeto.supabase.co";
   const SUPABASE_ANON_KEY = "sua-chave-anon-aqui";
   ```
6. Suba a alteração pro GitHub — a Vercel republica sozinha.

A chave `anon` é pública por natureza (ela só permite leitura, conforme a política de segurança já configurada no `schema.sql`), então pode ficar direto no código do site sem problema.

## 4. Trocar o número de WhatsApp ou textos

O número usado em todos os botões é `5583988858206` (o mesmo do site atual). Pra trocar, busque por esse número no `index.html` — ele aparece em cada botão de WhatsApp, sempre com uma mensagem pré-pronta diferente por seção/plano.

## 5. Fontes e ícones

O site usa as fontes **Space Grotesk** (títulos) e **Inter** (texto), carregadas via Google Fonts, e ícones em SVG embutido — não depende de nenhuma biblioteca externa além do cliente do Supabase.
