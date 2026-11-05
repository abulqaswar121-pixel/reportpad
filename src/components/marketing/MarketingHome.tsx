import { ArrowRight, Check, CreditCard, Link2, MessageCircle, Package, Sparkles } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { Shell } from './SiteShell';
import { plans } from '@/lib/plans';
import merchantPhoto from '@/assets/shopos-merchant.jpg';
import productPhoto from '@/assets/shopos-products.jpg';

const benefits = [
  { icon: Link2, title: 'Your name. Your store.', body: 'Choose your logo and colours. Give customers one link to shop with you.' },
  { icon: Package, title: 'More ways to sell', body: 'Sell products, digital downloads or services from the same store.' },
  { icon: CreditCard, title: 'Easy payments', body: 'Let customers pay online. See orders and manage your earnings in one place.' },
  { icon: MessageCircle, title: 'Keep WhatsApp close', body: 'Let shoppers send their order to your WhatsApp, ready for you to confirm.' },
];
const steps = [
  { title: 'Make it yours', body: 'Create your account, name your store and choose your look.' },
  { title: 'Add what you sell', body: 'Upload photos, set prices and choose your delivery fees.' },
  { title: 'Share your store', body: 'Put your link on WhatsApp or Instagram and start taking orders.' },
];

export function MarketingHome() {
  return (
    <Shell>
      <div className="shopos-home">
        <section className="home-hero">
          <img src={merchantPhoto} width={1920} height={1280} className="home-hero-photo" alt="A business owner preparing a clothing order in a bright boutique" fetchPriority="high" />
          <div className="home-hero-wash" aria-hidden="true" />
          <div className="home-container home-hero-inner">
            <div className="home-hero-copy">
              <span className="home-hero-label"><Sparkles size={15} /> Your business, online.</span>
              <h1>NDH ShopOS</h1>
              <p>Your own online store. Your name, your products, your customers. All in one place.</p>
              <div className="home-actions">
                <Link to="/signup" className="home-primary-link">Create your store <ArrowRight size={18} /></Link>
                <a href="#how-it-works" className="home-text-link">See how it works <ArrowRight size={16} /></a>
              </div>
              <span className="home-trial-note"><Check size={15} /> 14-day free trial · No card needed</span>
            </div>
          </div>
        </section>

        <section className="home-section">
          <div className="home-container">
            <div className="home-benefit-head">
              <div><span className="home-kicker">Made for your business</span><h2 className="home-title">A store that feels like you.</h2></div>
              <p className="home-lead">Spend less time juggling orders and more time growing your business.</p>
            </div>
            <div className="home-benefits">
              {benefits.map(({ icon: Icon, title, body }) => <article className="home-benefit" key={title}>
                <span className="home-benefit-icon"><Icon size={21} /></span>
                <h3>{title}</h3><p>{body}</p>
              </article>)}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="home-section home-process scroll-mt-20">
          <div className="home-container home-process-grid">
            <div>
              <span className="home-kicker">From idea to orders</span>
              <h2 className="home-title">Three steps. One store.</h2>
              <div className="home-steps">
                {steps.map((step, index) => <div className="home-step" key={step.title}><span className="home-step-number">0{index + 1}</span><div><h3>{step.title}</h3><p>{step.body}</p></div></div>)}
              </div>
              <Link to="/signup" className="home-text-link mt-8 text-info">Let’s build your store <ArrowRight size={16} /></Link>
            </div>
            <img src={productPhoto} width={1280} height={960} className="home-product-photo" alt="Clothing, shoes and skincare arranged beside a delivery box" loading="lazy" />
          </div>
        </section>

        <section id="pricing" className="home-section scroll-mt-20">
          <div className="home-container">
            <div className="home-pricing-head">
              <div><span className="home-kicker">Room to grow</span><h2 className="home-title">A plan for your next step.</h2><p className="home-lead">Start small. Choose more tools when you need them.</p></div>
              <Link to="/pricing" className="home-text-link text-info">Compare plans <ArrowRight size={16} /></Link>
            </div>
            <div className="home-pricing-grid">
              {plans.map(plan => <article className="home-plan" key={plan.name} data-featured={Boolean(plan.popular)}>
                <h3>{plan.name}</h3>
                <p className="home-plan-price">{plan.monthly}<span> / month</span></p>
                <p>{plan.limits[0]}<br />{plan.fee}</p>
                <Link to={plan.ctaTo} className="home-plan-link">{plan.ctaTo === '/book-call' ? 'Talk to us' : 'Choose this plan'}<ArrowRight size={16} /></Link>
              </article>)}
            </div>
            <p className="mt-6 text-sm leading-7 text-muted-foreground">Prices in Naira. Transaction fees apply to orders.</p>
          </div>
        </section>

        <section className="home-bottom">
          <div className="home-container home-bottom-inner">
            <div><h2>Your business deserves its own store.</h2><p>Take the first step. We’ll help you get started.</p></div>
            <Link to="/signup" className="home-primary-link">Create your store <ArrowRight size={18} /></Link>
          </div>
        </section>
      </div>
    </Shell>
  );
}
