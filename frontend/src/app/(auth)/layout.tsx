import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full flex-col lg:flex-row">
      {/* Left Side: Branding & Image */}
      <div className="relative hidden w-1/2 flex-col justify-between bg-black p-10 text-white lg:flex">
        <div className="absolute inset-0 z-0 opacity-40">
          <Image
            src="/auth-branding.png"
            alt="CodePilot AI Branding"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
        </div>

        <div className="relative z-10 flex items-center gap-2 text-xl font-bold tracking-tight">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <span className="text-white">C</span>
          </div>
          CodePilot AI
        </div>

        <div className="relative z-10">
          <blockquote className="space-y-2">
            <p className="text-lg font-medium">
              &ldquo;The AI-powered code review platform that helps us ship 3x faster
              with zero security compromises. Truly a game-changer for our
              engineering team.&rdquo;
            </p>
            <footer className="text-sm text-zinc-400">
              — Sarah Chen, Lead Engineer at TechFlow
            </footer>
          </blockquote>
        </div>
      </div>

      {/* Right Side: Auth Forms */}
      <div className="flex flex-1 items-center justify-center bg-background p-6 lg:p-12">
        <div className="w-full max-w-[400px] space-y-6">
          {children}
        </div>
      </div>
    </div>
  );
}
