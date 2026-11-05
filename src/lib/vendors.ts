import {hasSupabase} from '@/lib/supabase/env'
import {createServerFn} from '@tanstack/react-start'
import {getCookie} from '@tanstack/react-start/server'
import {getSupabaseServerClient} from './supabase/server'
import type {DesignSettings,VendorArchetype} from '@/types/schema'

const ACCESS_COOKIE='ndh_access_token'
function configured(){return Boolean(hasSupabase())}

/**
 * Raised when a visitor is not signed in. Routes convert this into a clean
 * redirect to `/signin?redirect=...` instead of surfacing a server error.
 */
export class SignInRequiredError extends Error{
  readonly redirectTo:string
  constructor(redirectTo='/onboarding'){
    super('Sign in to continue with your store setup.')
    this.name='SignInRequiredError'
    this.redirectTo=redirectTo
  }
}

export function isSignInRequired(error:unknown):error is SignInRequiredError{
  return error instanceof SignInRequiredError
}
async function authenticatedClient(){
  if(!configured())return null
  const token=getCookie(ACCESS_COOKIE)
  if(!token)throw new Error('You must sign in before setting up a store.')
  const client=getSupabaseServerClient(token)
  const {data:{user},error}=await client.auth.getUser(token)
  if(error||!user)throw new Error('Your session has expired. Please sign in again.')
  return {client,user}
}
function normalizeSlug(value:string){return value.toLowerCase().trim().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'').slice(0,64)}
function validHex(value:string){return /^#[0-9a-f]{6}$/i.test(value)}
const reservedSlugs=new Set(['admin','api','auth','billing','dashboard','help','login','ndh','onboarding','pricing','privacy','settings','signup','store','support','terms'])

export const getOnboardingState=createServerFn({method:'GET'}).handler(async()=>{
  // Demo mode: nothing is configured, so the setup flow stays previewable.
  if(!configured())return {configured:false,user:null,vendor:null,signedOut:false}
  const token=getCookie(ACCESS_COOKIE)
  // Signed-out visitors get a flag, never an unhandled error.
  if(!token)return {configured:true,user:null,vendor:null,signedOut:true}
  try{
    const context=await authenticatedClient()
    if(!context)return {configured:false,user:null,vendor:null,signedOut:false}
    const {data:vendor}=await context.client.from('vendors').select('*').eq('owner_user_id',context.user.id).maybeSingle()
    return {configured:true,user:{id:context.user.id,email:context.user.email??'',fullName:String(context.user.user_metadata.full_name??'')},vendor,signedOut:false}
  }catch{
    // An expired or rejected session is treated as signed out.
    return {configured:true,user:null,vendor:null,signedOut:true}
  }
})

export const verifyVendorSlug=createServerFn({method:'GET'}).validator((value:string)=>value).handler(async({data})=>{
  const slug=normalizeSlug(data)
  if(slug.length<3)return {slug,available:false,reason:'Use at least three characters.'}
  if(reservedSlugs.has(slug))return {slug,available:false,reason:'This address is reserved by NDH ShopOS.'}
  if(!configured())return {slug,available:slug!=='amari-atelier',reason:slug==='amari-atelier'?'This address is already in use.':null}
  const client=getSupabaseServerClient()
  const {data:existing,error}=await client.from('vendors').select('id').eq('shop_slug',slug).maybeSingle()
  if(error)throw new Error('We could not verify this store address.')
  return {slug,available:!existing,reason:existing?'This address is already in use.':null}
})

type OnboardingPayload={
  businessName:string;email:string;whatsappNumber:string;shopSlug:string;businessCategory:VendorArchetype;
  businessDescription:string;designSettings:DesignSettings
}
export const completeVendorOnboarding=createServerFn({method:'POST'}).validator((value:OnboardingPayload)=>value).handler(async({data})=>{
  let context:Awaited<ReturnType<typeof authenticatedClient>>
  try{
    context=await authenticatedClient()
  }catch(error){
    // Surface a friendly, actionable result — the client sends them to sign in.
    return {
      ok:false,demoMode:false,vendorId:null,shopSlug:normalizeSlug(data.shopSlug),
      error:'Please sign in to publish your store.',
      signInRequired:true,
      redirectTo:'/onboarding',
      reason:error instanceof Error?error.message:null,
    }
  }
  if(!context)return {ok:true,demoMode:true,vendorId:'demo-vendor',shopSlug:normalizeSlug(data.shopSlug),error:null,signInRequired:false,redirectTo:null}
  const shopSlug=normalizeSlug(data.shopSlug),businessName=data.businessName.trim(),whatsapp=data.whatsappNumber.replace(/[^0-9+]/g,'')
  if(businessName.length<2||businessName.length>120)return {ok:false,demoMode:false,vendorId:null,shopSlug,error:'Enter a valid business name.',signInRequired:false,redirectTo:null}
  if(shopSlug.length<3||reservedSlugs.has(shopSlug))return {ok:false,demoMode:false,vendorId:null,shopSlug,error:'Choose another store address.',signInRequired:false,redirectTo:null}
  if(whatsapp.replace(/\D/g,'').length<10)return {ok:false,demoMode:false,vendorId:null,shopSlug,error:'Enter a complete WhatsApp number.',signInRequired:false,redirectTo:null}
  if(!validHex(data.designSettings.primary_accent)||!validHex(data.designSettings.background_accent))return {ok:false,demoMode:false,vendorId:null,shopSlug,error:'Store colours must use valid six-digit colour values.',signInRequired:false,redirectTo:null}
  const settings={...data.designSettings,enabled_pages:data.designSettings.enabled_pages.slice(0,12),homepage_order:data.designSettings.homepage_order.slice(0,12),logo_text:data.designSettings.logo_text.slice(0,4)}
  const payload={owner_user_id:context.user.id,email:context.user.email??data.email.trim().toLowerCase(),business_name:businessName,shop_slug:shopSlug,whatsapp_number:whatsapp,business_category:data.businessCategory,business_description:data.businessDescription.trim().slice(0,1200),design_settings:settings,subscription_tier:'starter' as const,billing_cycle:'monthly' as const,subscription_status:'trial' as const,published:true}
  const vendorTable=context.client.from('vendors')
  const {data:existing}=await vendorTable.select('id').eq('owner_user_id',context.user.id).maybeSingle()
  const query=existing?vendorTable.update(payload).eq('id',existing.id).select('id,shop_slug').single():vendorTable.insert(payload).select('id,shop_slug').single()
  const {data:vendor,error}=await query
  if(error){if(error.code==='23505')return {ok:false,demoMode:false,vendorId:null,shopSlug,error:'That store address was just claimed. Choose another one.',signInRequired:false,redirectTo:null};return {ok:false,demoMode:false,vendorId:null,shopSlug,error:'We could not save your store. Please try again.',signInRequired:false,redirectTo:null}}
  return {ok:true,demoMode:false,vendorId:vendor.id,shopSlug:vendor.shop_slug,error:null,signInRequired:false,redirectTo:null}
})
