import { useState } from "react";
import Navbar from "@/components/portfolio/Navbar";
import Hero from "@/components/portfolio/Hero";
import { About } from "@/components/portfolio/About";
import { Portfolio } from "@/components/portfolio/Portfolio";
import { Skills } from "@/components/portfolio/Skills";
import { Contact } from "@/components/portfolio/Contact";
import Footer from "@/components/portfolio/Footer";
import { Terminal } from "@/components/portfolio/Terminal";
import { CircuitBackground } from "@/components/portfolio/CircuitBackground";
import { BootSequence } from "@/components/portfolio/BootSequence";
import { SensorFeed } from "@/components/portfolio/SensorFeed";
import { BlueprintMap } from "@/components/portfolio/BlueprintMap";
import { KonamiEasterEgg } from "@/components/portfolio/KonamiEasterEgg";

export default function Home() {
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [blueprintOpen, setBlueprintOpen] = useState(false);
  const [booted, setBooted] = useState(
    () => sessionStorage.getItem("abyss_boot_seen") === "1"
  );

  return (
    <>
      <div id="abyss-root" className="relative min-h-screen bg-[#050505] text-white">
        <CircuitBackground />

        {!booted && (
          <BootSequence
            onDone={() => {
              sessionStorage.setItem("abyss_boot_seen", "1");
              setBooted(true);
            }}
          />
        )}

        <Navbar
          onToggleTerminal={() => setTerminalOpen(true)}
          onToggleBlueprint={() => setBlueprintOpen(true)}
        />
        <main>
          <Hero onToggleTerminal={() => setTerminalOpen(true)} />
          <About />
          <Portfolio />
          <Skills />
          <Contact />
        </main>
        <Footer />
        <SensorFeed />
        {terminalOpen && <Terminal onClose={() => setTerminalOpen(false)} />}
      </div>

      <BlueprintMap open={blueprintOpen} onClose={() => setBlueprintOpen(false)} />
      <KonamiEasterEgg />
    </>
  );
}
