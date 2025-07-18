create table users (
  id uuid primary key references auth.users(id),
  email text unique not null,
  active boolean not null default true,
  created_at timestamp default current_timestamp
);

create table groups (
  id serial primary key,
  name text not null,
  manager uuid not null references users(id),
  created_at timestamp default current_timestamp
);

create table members (
  user_id uuid not null references users(id),
  group_id int not null references groups(id) on delete cascade,
  joined_at timestamp default current_timestamp,
  primary key (user_id, group_id)
);

create table tasks (
  id serial primary key,
  group_id int not null references groups(id) on delete cascade,
  description text not null,
  created_by uuid not null references users(id),
  created_at timestamp default current_timestamp,
  claimed_by uuid references users(id),
  completed boolean not null default false
);

create type invite_status as enum ('pending', 'accepted', 'rejected');

create table invites (
  id serial primary key,
  group_id int not null references groups(id) on delete cascade,
  from_user uuid not null references users(id),
  to_user uuid not null references users(id),
  status invite_status not null default 'pending',
  created_at timestamp default current_timestamp
);