import { Hero } from "../components/Hero";
import { HowItWorks } from "../components/HowItWorks";
import { Pricing } from "../components/Pricing";

// App Header (copied from dashboard)
function AppHeader() {
  return (
    <header className="w-full fixed top-0 left-0 z-30 bg-white/80 border-b border-blue-100 shadow-sm h-16 flex items-center px-6 md:px-12">
      <div className="flex items-center gap-2">
        <span className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-fuchsia-600 via-blue-600 to-indigo-500 bg-clip-text text-transparent tracking-tight drop-shadow-sm">anime</span>
        <span className="text-xs md:text-sm font-medium text-blue-700 ml-2">AI Art SaaS</span>
      </div>
    </header>
  );
}

export default function Home() {
  return (
    <>
      <AppHeader />
      <main className="flex flex-col min-h-screen pt-16">
        <Hero />
        <HowItWorks />
        <Pricing />
      </main>
    </>
  );
}
