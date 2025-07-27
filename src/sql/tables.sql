drop table invites cascade;
drop table tasks cascade;
drop table members cascade;
drop table groups cascade;
drop table users cascade;
drop type member_role;
drop type task_status;
drop type invite_status;

create table users (
  user_id uuid primary key references auth.users(id),
  email text unique not null,
  active boolean not null default true,
  created_at timestamp default current_timestamp
);

create table groups (
  group_id uuid primary key default uuid_generate_v4(),
  name text not null,
  creator_id uuid not null references users(user_id),
  created_at timestamp default current_timestamp
);

create type member_role as enum ('creator', 'admin', 'member');

create table members (
  user_id uuid not null references users(user_id),
  group_id uuid not null references groups(group_id) on delete cascade,
  role member_role not null default 'member',
  joined_at timestamp default current_timestamp,
  primary key (user_id, group_id)
);

create type task_status as enum ('pending', 'claimed', 'completed');

create table tasks (
  task_id uuid primary key default uuid_generate_v4(),
  group_id uuid not null references groups(group_id) on delete cascade,
  description text not null,
  creator_id uuid not null references users(user_id),
  claimer_id uuid references users(user_id),
  status task_status not null default 'pending',
  created_at timestamp default current_timestamp
);

create type invite_status as enum ('pending', 'accepted', 'rejected', 'revoked');

create table invites (
  invite_id uuid primary key default uuid_generate_v4(),
  group_id uuid not null references groups(group_id) on delete cascade,
  from_user_id uuid not null references users(user_id),
  to_user_id uuid not null references users(user_id),
  status invite_status not null default 'pending',
  created_at timestamp default current_timestamp
);

alter table users enable row level security;
alter table groups enable row level security;
alter table members enable row level security;
alter table tasks enable row level security;
alter table invites enable row level security;

create policy "Users can view groups they are a member of"
on groups
for select
using (
  exists (
    select 1
    from members
    where
      members.group_id = groups.group_id
      and members.user_id = auth.uid()
  )
);

/* 
Basic RLS
Checks for authenticated user on all tables
Could implement stricter checks here, some taken care of in queries themselves
*/
CREATE POLICY "Allow all access for auth users - users"
ON users
FOR ALL
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Allow all access for auth users - groups"
ON groups
FOR ALL
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Allow all access for auth users - members"
ON members
FOR ALL
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Allow all access for auth users - invites"
ON invites
FOR ALL
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Allow all access for auth users - tasks"
ON tasks
FOR ALL
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);