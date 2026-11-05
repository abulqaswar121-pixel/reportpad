import {pageMeta} from '@/lib/seo';
import {createFileRoute,redirect} from '@tanstack/react-router';
import {OnboardingAI} from '@/components/onboarding/OnboardingAI';
import {getOnboardingState} from '@/lib/vendors';

/**
 * Store setup. Signed-out visitors are sent to the sign-in screen with a
 * return path instead of hitting an unhandled server error.
 */
export const Route=createFileRoute('/onboarding')({
  head:()=>({meta:pageMeta({
    title:'Set up your store | NDH ShopOS',
    description:'Guided store setup: name your business, claim your store link and publish your branded storefront.',
  })}),
  beforeLoad:async()=>{
    let state:Awaited<ReturnType<typeof getOnboardingState>>
    try{
      state=await getOnboardingState()
    }catch{
      // Never surface a server error for a guest — ask them to sign in.
      throw redirect({to:'/signin',search:{redirect:'/onboarding'}})
    }
    if(state.signedOut||(state.configured&&!state.user))throw redirect({to:'/signin',search:{redirect:'/onboarding'}})
    if(state.vendor)throw redirect({to:'/dashboard'})
    return{state}
  },
  component:Page,
});

function Page(){
  const {state}=Route.useRouteContext();
  return <OnboardingAI initialEmail={state.user?.email} initialName={state.user?.fullName}/>;
}
