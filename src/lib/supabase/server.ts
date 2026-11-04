import {createClient} from '@supabase/supabase-js'
import type {Database} from '@/types/database'
import {supabasePublicKey,supabaseUrl} from './env'

function required(name:string,value:string|undefined){
  if(!value) throw new Error(`Missing required server environment variable: ${name}`)
  return value
}

// New-style keys are not tokens: send them as the apikey header and never as a Bearer token.
function keyFetch(key:string):typeof fetch{
  return (input,init)=>{
    const headers=new Headers(typeof Request!=='undefined'&&input instanceof Request?input.headers:undefined)
    if(init?.headers)new Headers(init.headers).forEach((value,name)=>headers.set(name,value))
    if((key.startsWith('sb_publishable_')||key.startsWith('sb_secret_'))&&headers.get('Authorization')===`Bearer ${key}`)headers.delete('Authorization')
    headers.set('apikey',key)
    return fetch(input,{...init,headers})
  }
}

export function getSupabaseServerClient(accessToken?:string){
  const url=required('SUPABASE_URL',supabaseUrl())
  const anonKey=required('SUPABASE_PUBLISHABLE_KEY',supabasePublicKey())
  return createClient<Database>(url,anonKey,{global:{fetch:keyFetch(anonKey),headers:accessToken?{Authorization:`Bearer ${accessToken}`}:{}},auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}})
}

export function getSupabaseAdminClient(){
  const url=required('SUPABASE_URL',supabaseUrl())
  const serviceRoleKey=required('SUPABASE_SERVICE_ROLE_KEY',process.env.SUPABASE_SERVICE_ROLE_KEY)
  return createClient<Database>(url,serviceRoleKey,{global:{fetch:keyFetch(serviceRoleKey)},auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}})
}
