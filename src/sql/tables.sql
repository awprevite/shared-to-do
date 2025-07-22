drop table invites;
drop table tasks;
drop table members;
drop table groups;
drop table users;
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

create table members (
  user_id uuid not null references users(user_id),
  group_id uuid not null references groups(group_id) on delete cascade,
  joined_at timestamp default current_timestamp,
  primary key (user_id, group_id)
);

create table tasks (
  task_id uuid primary key default uuid_generate_v4(),
  group_id uuid not null references groups(group_id) on delete cascade,
  description text not null,
  creator_id uuid not null references users(user_id),
  created_at timestamp default current_timestamp,
  claimer_id uuid references users(user_id),
  completed boolean not null default false
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