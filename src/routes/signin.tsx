import {pageMeta} from '@/lib/seo';
import {createFileRoute} from '@tanstack/react-router';
import {AuthPanel} from '@/components/auth/AuthPanel';
import {SiteHeader,SiteFooter} from '@/components/marketing/SiteShell';

/** Only same-site paths are honoured as a post sign-in destination. */
function safeRedirect(value:unknown){
  const path=typeof value==='string'?value:'';
  return path.startsWith('/')&&!path.startsWith('//')?undefined:path?'/dashboard':undefined;
}

export const Route=createFileRoute('/signin')({
  // Optional, so ordinary "/signin" links keep working.
  validateSearch:(search:{redirect?:unknown}):{redirect?:string}=>({redirect:safeRedirect(search.redirect)}),
  head:()=>({meta:pageMeta({
    title:`Merchant sign in | NDH ShopOS`,
    description:`Sign in to your NDH ShopOS merchant dashboard: products, orders, delivery rates, marketing and payouts.`,
  })}),
  component:Page,
});

function Page(){
  const {redirect}=Route.useSearch();
  return <main><SiteHeader/><AuthPanel redirectTo={redirect??'/dashboard'}/><SiteFooter/></main>;
}
