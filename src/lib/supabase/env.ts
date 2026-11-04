import {getRequest} from '@tanstack/react-start/server'

// Server-side connection settings. The live website and the preview expose these
// under slightly different names, so every lookup checks all of them.
export function supabaseUrl(){
  return process.env.SUPABASE_URL||process.env.VITE_SUPABASE_URL||''
}

export function supabasePublicKey(){
  return process.env.SUPABASE_PUBLISHABLE_KEY||process.env.VITE_SUPABASE_PUBLISHABLE_KEY||process.env.VITE_SUPABASE_ANON_KEY||''
}

export function hasSupabase(){
  return Boolean(supabaseUrl()&&supabasePublicKey())
}

export function hasSupabaseAdmin(){
  return Boolean(supabaseUrl()&&process.env.SUPABASE_SERVICE_ROLE_KEY)
}

// Public website address used in payment return links and email links.
// Uses APP_URL when set, otherwise the address the visitor is actually on.
export function appUrl(){
  const configured=process.env.APP_URL?.replace(/\/$/,'')
  if(configured&&!configured.includes('localhost'))return configured
  try{return new URL(getRequest().url).origin}catch{return configured||'http://localhost:8080'}
}
