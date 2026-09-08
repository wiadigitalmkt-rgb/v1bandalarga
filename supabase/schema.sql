-- =========================================================
-- V1 BANDA LARGA — schema do Supabase
-- Rode este script em: Supabase > SQL Editor > New query
-- =========================================================

-- Tabela de bairros/área de cobertura -----------------------
create table if not exists cobertura_bairros (
  id bigint generated always as identity primary key,
  bairro text not null,
  status text not null default 'confirmar' check (status in ('disponivel', 'em_expansao', 'confirmar')),
  observacao text,
  created_at timestamptz not null default now()
);

-- Leitura pública (o site consulta essa tabela direto do navegador)
alter table cobertura_bairros enable row level security;

create policy "Leitura publica de cobertura"
  on cobertura_bairros for select
  using (true);

-- Nenhuma política de insert/update/delete é criada aqui de propósito:
-- edite a tabela pelo painel do Supabase (Table Editor), não pelo site.

-- Seed com os bairros reais de Santa Rita-PB -----------------
-- status = 'confirmar' em todos: ATUALIZE cada linha para
-- 'disponivel' ou 'em_expansao' de acordo com a cobertura real
-- da V1 antes de publicar o site.
insert into cobertura_bairros (bairro, status) values
  ('Açude', 'confirmar'),
  ('Capitão', 'confirmar'),
  ('Centro', 'confirmar'),
  ('Distrito de Várzea Nova', 'confirmar'),
  ('Distrito Industrial Flávio Ribeiro Coutinho', 'confirmar'),
  ('Distrito Industrial Metropolitano', 'confirmar'),
  ('Heitel Santiago', 'confirmar'),
  ('Jardim Carolina', 'confirmar'),
  ('Jardim Europa', 'confirmar'),
  ('Jardins', 'confirmar'),
  ('Liberdade', 'confirmar'),
  ('Marcos Moura', 'confirmar'),
  ('Municípios', 'confirmar'),
  ('Naelson Panta Júnior', 'confirmar'),
  ('Popular', 'confirmar'),
  ('Portal de Tibiri', 'confirmar'),
  ('Privê Aeroporto', 'confirmar'),
  ('Santo Amaro', 'confirmar'),
  ('Tibiri', 'confirmar'),
  ('Vale das Águas', 'confirmar'),
  ('Vale de Santa Rita', 'confirmar'),
  ('Vidal de Negreiros', 'confirmar')
on conflict do nothing;

-- =========================================================
-- Tabela opcional de leads ("Nós te ligamos" / formulários futuros)
-- Descomente se quiser guardar contatos direto no Supabase.
-- =========================================================
-- create table if not exists leads (
--   id bigint generated always as identity primary key,
--   nome text,
--   telefone text not null,
--   bairro text,
--   origem text default 'site',
--   created_at timestamptz not null default now()
-- );
--
-- alter table leads enable row level security;
--
-- create policy "Qualquer um pode cadastrar lead"
--   on leads for insert
--   with check (true);
-- -- (sem política de select: só a equipe, autenticada no painel, ve os leads)
