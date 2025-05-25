import { supabase } from '../services/supabase';

export const fetchUsers = async () => {
  // In a real application, you would fetch data from Supabase here.
  // const { data, error } = await supabase.from('users').select('*');
  // if (error) {
  //   console.error('Error fetching users:', error.message);
  //   throw new Error('Failed to fetch users');
  // }
  // return data;

  // Dummy data for now
  return [
    { id: 1, name: 'Alice Smith', email: 'alice@example.com' },
    { id: 2, name: 'Bob Johnson', email: 'bob@example.com' },
  ];
};

export const registerUser = async (email: string, password: string, firstName: string, lastName: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
      },
    },
  });

  if (error || !data) {
    console.error('Error registering user:', error?.message);
    throw new Error('Failed to register user');
  }

  return data;
};

export const loginUser = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !data) {
    console.error('Error logging in user:', error?.message);
    throw new Error('Failed to login user');
  }

  return data;
};