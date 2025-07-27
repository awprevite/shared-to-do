export function mapSupabaseError(error: Error): string {
  const message = error.message.toLowerCase()

  if (message.includes('missing')) return 'Missing email or password'
  //if (message.includes('invalid')) return 'Incorrect email or password'
  if (message.includes('duplicate key')) return 'An account with this email already exists'
  //if (message.includes('password')) return 'Password must be atleast 6 characters'
  if (message.includes('not confirmed')) return 'Confirm your email before signing in'

  return message + ' - Has not been experienced before, not included in mapping list'
}