export type User = {
  user_id: string;
  email: string;
  created_at: string;
}

export type Group = {
  group_id: string;
  name: string;
  creator: string;
  created_at: string;
}

export type Member = {
  user_id: string;
  group_id: string;
  role: 'creator' | 'admin' | 'member';
  joined_at: string;
  users?: {
    email: string
  }
}

export type Task = {
  task_id: string;
  group_id: string;
  description: string;
  creator_id: string;
  claimer_id: string | null;
  status: 'pending' | 'claimed' | 'completed';
  created_at: string;
  users?: {
    email: string
  }
}

export type Invite = {
  invite_id: string;
  group_id: string;
  from_user_id: string;
  to_user_id: string;
  status: 'pending' | 'accepted' | 'rejected' | 'revoked';
  created_at: string;
  groups?: {
    name: string
  }
  users?: {
    email: string
  }
}