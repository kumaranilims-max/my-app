import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../../components/supabaseClient';

export async function POST(request: NextRequest) {
  try {
    const { username, email, mobile, password } = await request.json();
    
    // Check for existing username
    const { data: existingUsername } = await supabase
      .from('users')
      .select('username')
      .eq('username', username)
      .single();
    
    if (existingUsername) {
      return NextResponse.json({ error: 'Username already exists' }, { status: 400 });
    }
    
    // Check for existing email
    const { data: existingEmail } = await supabase
      .from('users')
      .select('email')
      .eq('email', email)
      .single();
    
    if (existingEmail) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
    }
    
    // Check for existing mobile
    const { data: existingMobile } = await supabase
      .from('users')
      .select('mobile')
      .eq('mobile', mobile)
      .single();
    
    if (existingMobile) {
      return NextResponse.json({ error: 'Mobile number already exists' }, { status: 400 });
    }
    
    // Create new user
    const { data: newUser, error } = await supabase
      .from('users')
      .insert([{ username, email, mobile, password }])
      .select()
      .single();
    
    if (error) {
      return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'User created successfully'
    });
    
  } catch (error) {
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}