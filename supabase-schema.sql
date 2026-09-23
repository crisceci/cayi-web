-- Esquema de Supabase para la web pública de Cayi Studio.
-- Puedes correr esto en el MISMO proyecto de Supabase que ya usas para
-- el Panel Cayi Studio (crea una tabla y un bucket nuevos, no toca `clients` ni `projects`)
-- o en un proyecto nuevo — como prefieras.

-- 1) Tabla de contenido: una sola fila (id = 1) con todo el contenido de la web en una columna JSON.
create table if not exists cayi_web_content (
  id int primary key default 1,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

insert into cayi_web_content (id, data)
values (1, '{}'::jsonb)
on conflict (id) do nothing;

alter table cayi_web_content enable row level security;

drop policy if exists "cayi_web_content_select" on cayi_web_content;
create policy "cayi_web_content_select" on cayi_web_content for select using (true);

drop policy if exists "cayi_web_content_update" on cayi_web_content;
create policy "cayi_web_content_update" on cayi_web_content for update using (true);

drop policy if exists "cayi_web_content_insert" on cayi_web_content;
create policy "cayi_web_content_insert" on cayi_web_content for insert with check (true);

-- 2) Bucket de almacenamiento para las fotos/videos que subas desde el panel de administrador.
insert into storage.buckets (id, name, public)
values ('cayi-web-assets', 'cayi-web-assets', true)
on conflict (id) do nothing;

drop policy if exists "cayi_web_assets_read" on storage.objects;
create policy "cayi_web_assets_read" on storage.objects for select
  using (bucket_id = 'cayi-web-assets');

drop policy if exists "cayi_web_assets_write" on storage.objects;
create policy "cayi_web_assets_write" on storage.objects for insert
  with check (bucket_id = 'cayi-web-assets');

drop policy if exists "cayi_web_assets_update" on storage.objects;
create policy "cayi_web_assets_update" on storage.objects for update
  using (bucket_id = 'cayi-web-assets');
