-- Clean up old table definitions (if they exist) to avoid conflicts
drop table if exists public.dispatch_logs cascade;
drop table if exists public.responders cascade;
drop table if exists public.ambulances cascade;
drop table if exists public.emergency_units cascade;

-- 1. Ensure latitude/longitude columns exist on the public.sos_reports table
alter table public.sos_reports add column if not exists latitude double precision;
alter table public.sos_reports add column if not exists longitude double precision;
alter table public.sos_reports add column if not exists media_urls text[]; --new coloumn

-- 2. Create responders table (consolidated with roles and status)
create table public.responders (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    contact_number text not null,
    role text not null check (role in ('medical', 'fire', 'police', 'military')),
    status text not null check (status in ('available', 'busy')) default 'available',
    latitude double precision,
    longitude double precision,
    created_at timestamptz default now()
);

-- 3. Create dispatch_logs table
create table public.dispatch_logs (
    id uuid primary key default gen_random_uuid(),
    sos_id uuid references public.sos_reports(id) on delete cascade,
    responder_id uuid references public.responders(id) on delete cascade,
    dispatched_at timestamptz default now()
);

-- Enable Supabase Realtime replication on these tables safely
do $$
begin
    -- Add public.responders to publication if not already present
    if not exists (
        select 1 from pg_publication_rel pr 
        join pg_class c on pr.prrelid = c.oid 
        where c.relname = 'responders'
    ) then
        execute 'alter publication supabase_realtime add table public.responders';
    end if;

    -- Add public.sos_reports to publication if not already present
    if not exists (
        select 1 from pg_publication_rel pr 
        join pg_class c on pr.prrelid = c.oid 
        where c.relname = 'sos_reports'
    ) then
        execute 'alter publication supabase_realtime add table public.sos_reports';
    end if;

    -- Add public.dispatch_logs to publication if not already present
    if not exists (
        select 1 from pg_publication_rel pr 
        join pg_class c on pr.prrelid = c.oid 
        where c.relname = 'dispatch_logs'
    ) then
        execute 'alter publication supabase_realtime add table public.dispatch_logs';
    end if;
end $$;

-- 4. Enable Row Level Security (RLS)
alter table public.responders enable row level security;
alter table public.dispatch_logs enable row level security;

-- 5. Create RLS Policies allowing public read and write operations for testing
create policy "Allow public select on responders" on public.responders for select using (true);
create policy "Allow public update on responders" on public.responders for update using (true);
create policy "Allow public insert on responders" on public.responders for insert with check (true);

create policy "Allow public select on dispatch_logs" on public.dispatch_logs for select using (true);
create policy "Allow public insert on dispatch_logs" on public.dispatch_logs for insert with check (true);

-- 6. Create database transaction function for atomic dispatches by responder role
create or replace function public.dispatch_responder(
    p_sos_id uuid,
    p_responder_id uuid
)
returns json
language plpgsql
security definer -- runs with administrative privileges, bypassing RLS
as $$
declare
    v_responder_status text;
    v_responder_role text;
    v_sos_status text;
    v_new_sos_status text;
begin
    -- Check and lock responder status
    select status, role into v_responder_status, v_responder_role from public.responders where id = p_responder_id for update;
    if v_responder_status is null then
        raise exception 'Responder not found';
    end if;
    if v_responder_status != 'available' then
        raise exception 'Responder is currently busy (current status: %)', v_responder_status;
    end if;

    -- Check and lock SOS report status
    select status into v_sos_status from public.sos_reports where id = p_sos_id for update;
    if v_sos_status is null then
        raise exception 'SOS report not found';
    end if;
    if v_sos_status like '%_dispatched' or v_sos_status = 'dispatched' then
        raise exception 'SOS report is already dispatched';
    end if;

    -- Determine new status label based on responder role
    v_new_sos_status := v_responder_role || '_dispatched';

    -- Update SOS report status
    update public.sos_reports set status = v_new_sos_status where id = p_sos_id;

    -- Update selected responder status to busy
    update public.responders set status = 'busy' where id = p_responder_id;

    -- Insert record into dispatch logs
    insert into public.dispatch_logs (sos_id, responder_id) values (p_sos_id, p_responder_id);

    return json_build_object(
        'success', true,
        'message', 'Responder successfully dispatched',
        'new_status', v_new_sos_status
    );
exception
    when others then
        return json_build_object(
            'success', false,
            'message', SQLERRM
        );
end;
$$;

-- 7. Insert sample seed data for testing role-based responders
insert into public.responders (name, contact_number, role, status, latitude, longitude) values
('Dr. Sumith Bandara', '+94 77 123 4567', 'medical', 'available', 6.9271, 79.8612),
('Nuwan Perera (Fire Crew 01)', '+94 71 987 6543', 'fire', 'available', 7.2906, 80.6337),
('Sgt. Jayasinghe (Patrol 04)', '+94 75 555 4433', 'police', 'available', 6.9319, 79.8478),
('Major General Fonseka', '+94 77 888 9900', 'military', 'available', 6.9016, 79.8549),
('Officer Karunaratne (Patrol 02)', '+94 76 111 2233', 'police', 'busy', 7.2955, 80.6367),
('Kamal Gunawardena (Fire Crew 02)', '+94 72 222 3344', 'fire', 'busy', 6.9147, 79.8778);
