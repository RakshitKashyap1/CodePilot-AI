import { PricingCards } from "@/features/pricing/components/pricing-cards";
import { PricingFaq } from "@/features/pricing/components/pricing-faq";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Code2, ShieldCheck, Zap } from "lucide-react";
import { Github } from "@/components/shared/icons";

export const metadata = {
  title: "Pricing | CodePilot AI",
  description: "Flexible plans for individuals and teams. Scale your code quality with AI.",
};

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center p-6 lg:p-24 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none -z-10" />

      {/* Public Navbar (Simplified) */}
      <nav className="w-full max-w-7xl flex items-center justify-between mb-20 animate-in fade-in slide-in-from-top-4 duration-500">
        <Link href="/" className="flex items-center gap-2 font-bold tracking-tight text-xl">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <span className="text-white">C</span>
          </div>
          CodePilot AI
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/pricing" className="text-sm font-medium hover:text-primary transition-colors">Pricing</Link>
          <Link href="/docs" className="text-sm font-medium hover:text-primary transition-colors">Docs</Link>
          <Button variant="ghost" asChild>
            <Link href="/login">Login</Link>
          </Button>
          <Button variant="glow" asChild>
            <Link href="/signup">Get Started</Link>
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="text-center max-w-3xl space-y-4 mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <Badge variant="ai" className="mb-4">PRICING PLANS</Badge>
        <h1 className="text-5xl lg:text-7xl font-bold tracking-tighter text-gradient leading-tight">
          Supercharge your workflow at any scale.
        </h1>
        <p className="text-xl text-muted-foreground">
           Choose the plan that&apos;s right for you. From solo developers to enterprise teams, we&apos;ve got you covered.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="w-full max-w-7xl mb-32 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <PricingCards />
      </div>

      {/* Trusted By Section */}
      <div className="w-full max-w-7xl mb-32 text-center">
        <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-12">Trusted by engineers from top teams</p>
        <div className="flex flex-wrap justify-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all">
          <div className="flex items-center gap-2 font-bold text-2xl"><Github /> GitHub</div>
          <div className="flex items-center gap-2 font-bold text-2xl"><Code2 /> Vercel</div>
          <div className="flex items-center gap-2 font-bold text-2xl"><Zap /> Stripe</div>
          <div className="flex items-center gap-2 font-bold text-2xl"><ShieldCheck /> Supabase</div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="w-full max-w-7xl mb-32">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-muted-foreground">Everything you need to know about CodePilot AI pricing.</p>
        </div>
        <PricingFaq />
      </div>

      {/* Final CTA */}
      <div className="w-full max-w-5xl text-center p-12 lg:p-24 glass-dark rounded-3xl border border-primary/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-glow -z-10" />
        <h2 className="text-4xl font-bold mb-6">Ready to improve your code quality?</h2>
        <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
          Join 10,000+ developers who are already using CodePilot AI to ship faster, safer, and cleaner code.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button variant="glow" size="lg" className="h-14 px-10 text-lg">
            Start Your Free Trial
          </Button>
          <Button variant="outline" size="lg" className="h-14 px-10 text-lg bg-transparent">
            Schedule a Demo
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full max-w-7xl mt-32 py-12 border-t border-border flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-sm text-muted-foreground">© 2024 CodePilot AI Inc. All rights reserved.</p>
        <div className="flex gap-6">
          <Link href="/privacy" className="text-xs text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="text-xs text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link>
          <Link href="/contact" className="text-xs text-muted-foreground hover:text-primary transition-colors">Contact Us</Link>
        </div>
      </footer>
    </div>
  );
}

function Badge({ children, variant, className }: { children: React.ReactNode, variant: string, className?: string }) {
  const variants = {
    ai: "bg-primary/10 text-primary border-primary/20",
    outline: "border-border text-muted-foreground",
  };
  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-bold border uppercase tracking-widest ${variants[variant as keyof typeof variants]} ${className}`}>
      {children}
    </span>
  );
}
