-- Enable PostGIS extension for advanced geospatial queries
create extension if not exists postgis;

-- 1. Ensure latitude/longitude columns exist on the public.sos_reports table
alter table public.sos_reports add column if not exists latitude double precision;
alter table public.sos_reports add column if not exists longitude double precision;

-- 2. Create ambulances table
create table if not exists public.ambulances (
    id uuid primary key default gen_random_uuid(),
    license_plate text not null unique,
    status text not null check (status in ('available', 'en_route', 'busy', 'maintenance')) default 'available',
    latitude double precision not null,
    longitude double precision not null,
    created_at timestamptz default now()
);

-- 3. Create responders table
create table if not exists public.responders (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    contact_number text not null,
    ambulance_id uuid references public.ambulances(id) on delete set null,
    created_at timestamptz default now()
);

-- 4. Create dispatch_logs table (junction table)
create table if not exists public.dispatch_logs (
    id uuid primary key default gen_random_uuid(),
    sos_id uuid references public.sos_reports(id) on delete cascade,
    ambulance_id uuid references public.ambulances(id) on delete cascade,
    dispatched_at timestamptz default now()
);

-- 5. Enable Row Level Security (RLS) on new tables
alter table public.ambulances enable row level security;
alter table public.responders enable row level security;
alter table public.dispatch_logs enable row level security;

-- 6. Create RLS policies allowing public (anonymous) read and write operations for testing
create policy "Allow public select on ambulances" on public.ambulances for select using (true);
create policy "Allow public update on ambulances" on public.ambulances for update using (true);
create policy "Allow public insert on ambulances" on public.ambulances for insert with check (true);

create policy "Allow public select on responders" on public.responders for select using (true);
create policy "Allow public update on responders" on public.responders for update using (true);
create policy "Allow public insert on responders" on public.responders for insert with check (true);

create policy "Allow public select on dispatch_logs" on public.dispatch_logs for select using (true);
create policy "Allow public insert on dispatch_logs" on public.dispatch_logs for insert with check (true);

-- 7. Create database transaction function for atomic dispatches
create or replace function public.dispatch_ambulance(
    p_sos_id uuid,
    p_ambulance_id uuid
)
returns json
language plpgsql
security definer -- runs with administrative privileges, bypassing RLS
as $$
declare
    v_ambulance_status text;
    v_sos_status text;
begin
    -- Check and lock ambulance status
    select status into v_ambulance_status from public.ambulances where id = p_ambulance_id for update;
    if v_ambulance_status is null then
        raise exception 'Ambulance not found';
    end if;
    if v_ambulance_status != 'available' then
        raise exception 'Ambulance is not available (current status: %)', v_ambulance_status;
    end if;

    -- Check and lock SOS report status
    select status into v_sos_status from public.sos_reports where id = p_sos_id for update;
    if v_sos_status is null then
        raise exception 'SOS report not found';
    end if;
    if v_sos_status = 'dispatched' then
        raise exception 'SOS report is already dispatched';
    end if;

    -- Update SOS report status
    update public.sos_reports set status = 'dispatched' where id = p_sos_id;

    -- Update selected ambulance status
    update public.ambulances set status = 'en_route' where id = p_ambulance_id;

    -- Insert record into dispatch logs
    insert into public.dispatch_logs (sos_id, ambulance_id) values (p_sos_id, p_ambulance_id);

    return json_build_object(
        'success', true,
        'message', 'Ambulance successfully dispatched'
    );
exception
    when others then
        return json_build_object(
            'success', false,
            'message', SQLERRM
        );
end;
$$;

-- 8. Create database function to calculate proximity using PostGIS
create or replace function public.get_closest_ambulances(
    sos_lat double precision,
    sos_lng double precision
)
returns table (
    id uuid,
    license_plate text,
    status text,
    latitude double precision,
    longitude double precision,
    distance_meters double precision
)
language plpgsql
as $$
begin
    return query
    select
        a.id,
        a.license_plate,
        a.status,
        a.latitude,
        a.longitude,
        st_distance(
            st_setsrid(st_makepoint(a.longitude, a.latitude), 4326)::geography,
            st_setsrid(st_makepoint(sos_lng, sos_lat), 4326)::geography
        ) as distance_meters
    from
        public.ambulances a
    where
        a.status = 'available'
    order by
        distance_meters asc;
end;
$$;

-- 9. Insert sample seed data for testing
insert into public.ambulances (license_plate, status, latitude, longitude) values
('WP-CAD-5291', 'available', 6.9271, 79.8612), -- Colombo 03
('WP-CBA-9012', 'available', 6.9315, 79.8485), -- Pettah
('WP-CBD-1122', 'busy', 6.9189, 79.8580),      -- Kollupitiya
('WP-CAB-8844', 'maintenance', 6.9025, 79.8604); -- Bambalapitiya

insert into public.responders (name, contact_number, ambulance_id) values
('Sumith Bandara', '+94 77 123 4567', (select id from public.ambulances where license_plate = 'WP-CAD-5291')),
('Nuwan Perera', '+94 71 987 6543', (select id from public.ambulances where license_plate = 'WP-CBA-9012')),
('Amila Silva', '+94 75 555 4433', (select id from public.ambulances where license_plate = 'WP-CBD-1122')),
('Kamal Gunawardena', '+94 72 222 3344', null);
