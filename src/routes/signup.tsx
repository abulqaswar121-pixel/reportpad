import {pageMeta} from '@/lib/seo';
import {createFileRoute} from '@tanstack/react-router';
import {AuthPanel} from '@/components/auth/AuthPanel';
import {SiteHeader,SiteFooter} from '@/components/marketing/SiteShell';

function safeRedirect(value:unknown){
  const path=typeof value==='string'?value:'';
  return path.startsWith('/')&&!path.startsWith('//')?undefined:path?'/dashboard':undefined;
}

export const Route=createFileRoute('/signup')({
  // Optional, so ordinary "/signup" links keep working.
  validateSearch:(search:{redirect?:unknown}):{redirect?:string}=>({redirect:safeRedirect(search.redirect)}),
  head:()=>({meta:pageMeta({
    title:`Create your store — start your free trial | NDH ShopOS`,
    description:`Create your merchant account and launch a branded online store in minutes. Free to start, no card required.`,
  })}),
  component:Page,
});

function Page(){
  const {redirect}=Route.useSearch();
  return <main><SiteHeader/><AuthPanel initialMode="signup" redirectTo={redirect??'/onboarding'}/><SiteFooter/></main>;
}
