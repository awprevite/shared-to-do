# Shared To Do

A full-stack web application for managing tasks within collaborative user groups.  
Enables mutli-user to do lists with role based of priviledge.

## Features

### User Authentication  
Sign up, sign in, and confirm your account by email and password - powered by **Supabase Auth**.

### Group Management  
Create and manage groups. Invite users and assign roles.

### Task Management
Post tasks, claim them, and mark as completed.

### Real-Time Collaboration *(Coming Soon)*   
Automatic sync of group tasks and statuses - powered by **Supabase Realtime**.

### Role-Based Privileges  
Users have different levels of authority within a group:  
| Role        | Privileges |
|-------------|------------|
| **Member**  | Claim/complete tasks |
| **Admin**   | Invite/remove members, create/delete tasks |
| **Creator** | Remove members/admins, promote/demote users, delete group |

## Tech Stack  

| Technology       | Purpose |
|------------------|----------|
| **Next.js**      | Full-stack framework using App Router |
| **React**        | Frontend UI framework |
| **TypeScript**   | Static typing across codebase |
| **Tailwind CSS** | Responsive styling and layout |
| **Supabase**     | Auth, Database, row-level security (RLS) |
| **PostgreSQL**   | Relational Database |

## Screenshots / Demo  

## Future improvements  
- Task due dates and user specific assignments  
- Email updates and reminders
- Detailed activity log
- Improved mobile layout  
- Real-time syncing
- Invite users via email (not just to existing users)
- Password reset functionality
- Google sign-in functionality