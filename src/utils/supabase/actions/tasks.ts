'use server';
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { User, Group, Member, Task, Invite } from '@/utils/database/types'

/**
 * Fetches tasks for a group
 * 
 * @param group_id the ID of the group to fetch tasks for
 * 
 * @returns {Promise<Task[]>} an array of tasks in the group
 * @throws {Error} if the query fails
 */
export async function fetchTasks( group_id: string ): Promise<Task[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('tasks')
    .select('*, users:claimer_id (email)')
    .eq('group_id', group_id)
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)

  return data
}

/**
 * Inserts a new task into the 'tasks' table
 * 
 * @param group_id the ID of the group the task belongs to
 * @param description the task description
 * @param creator_id the ID of the user who created the task
 * 
 * @returns {Promise<Task[]>} an array of tasks in the group after inserting
 */
export async function createTask( group_id: string, description: string, creator_id: string ): Promise<Task[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('tasks')
    .insert([
      {
        group_id: group_id,
        description: description,
        creator_id: creator_id
      }
    ])

  if (error) throw new Error(error.message);

  const tasks = fetchTasks(group_id)

  return tasks
}

/**
 * Deletes a task from the 'tasks' table
 * 
 * @param task_id the ID of the task to delete
 * 
 * @returns {Promise<Task[]>} an array of tasks in the group after deletion
 * @throws {Error} if the query fails
 */
export async function deleteTask( task_id: string ): Promise<Task[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('tasks')
    .delete()
    .eq('task_id', task_id)
    .select()

  if (error) throw new Error(error.message)

  const group_id = data[0].group_id

  const tasks = fetchTasks(group_id)

  return tasks
}

/**
 * 
 * @param task_id 
 * @param new_status 
 * @param claimer_id 
 * 
 * @returns {Promise<Task[]>}
 * @throws {Error} if the query fails
 */
export async function updateTask( task_id: string, new_status: 'pending' | 'claimed' | 'completed', claimer_id: string ): Promise<Task[]> {
  const supabase = await createClient()

  let updateFields: Partial<Task> = { status: new_status }

  if (new_status === 'pending') {
    updateFields.claimer_id = null
  } else if (new_status === 'claimed') {
    updateFields.claimer_id = claimer_id
  }

  const { data, error } = await supabase
    .from('tasks')
    .update(updateFields)
    .eq('task_id', task_id)
    .select('*')
    .single()

  if (error) throw new Error(error.message)

  const group_id = data.group_id

  const tasks = fetchTasks(group_id)

  return tasks
}