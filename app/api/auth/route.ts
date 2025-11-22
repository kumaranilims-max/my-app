import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../components/supabaseClient';

export async function POST(request: NextRequest) {
  try {
    const { identifier, password } = await request.json();
    
    // Check if identifier is email, mobile, or username
    let query = supabase.from('users').select('*');
    
    if (identifier.includes('@')) {
      // Email login
      query = query.eq('email', identifier);
    } else if (/^\d+$/.test(identifier)) {
      // Mobile number login
      query = query.eq('mobile', identifier);
    } else {
      // Username login
      query = query.eq('username', identifier);
    }
    
    const { data: users, error } = await query;
    
    if (error) {
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }
    
    if (!users || users.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 });
    }
    
    const user = users[0];
    
    // Simple password check (in production, use proper hashing)
    if (user.password !== password) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }
    
    return NextResponse.json({ 
      success: true, 
      user: { 
        id: user.id, 
        username: user.username, 
        email: user.email 
      } 
    });
    
  } catch (error) {
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}