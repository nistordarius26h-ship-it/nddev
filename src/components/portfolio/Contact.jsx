import { Linkedin, Github, Mail } from "lucide-react";

const GITHUB_URL = "https://github.com/nistordarius26h-ship-it";
const LINKEDIN_URL = "https://www.linkedin.com/in/darius-nistor-3292783b1";
const CONTACT_EMAIL = "nistordarius26h@gmail.com";

export function Contact() {
  return (
    <section id="contact" className="relative bg-transparent border-t hairline scroll-mt-16">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10 py-20 lg:py-28">
        {/* Section header */}
        <div className="flex items-center gap-3 mb-10">
          <span className="mono text-[10px] uppercase tracking-[0.3em] text-white/40">
            [05]
          </span>
          <span className="h-px flex-1 bg-white/10" />
          <span className="mono text-[10px] uppercase tracking-[0.3em] text-white/40">
            CONTACT — TRANSMIT
          </span>
        </div>

        <div className="mx-auto max-w-xl text-center">
          <h2 className="block font-heading font-bold text-white text-3xl sm:text-4xl lg:text-5xl tracking-tight">
            Contact
          </h2>
          <p className="block mt-4 text-sm sm:text-base text-white/50 leading-relaxed">
            Have a system that needs building, breaking, or both? Reach out
            through any channel below.
          </p>

          {/* Channel buttons — LinkedIn, Email, GitHub */}
          <div className="mt-10 flex items-center justify-center gap-4">
            <ChannelButton
              href={LINKEDIN_URL}
              label="LinkedIn"
              Icon={Linkedin}
              external
            />
            <ChannelButton
              href={"mailto:" + CONTACT_EMAIL}
              label="Email"
              Icon={Mail}
            />
            <ChannelButton
              href={GITHUB_URL}
              label="GitHub"
              Icon={Github}
              external
            />
          </div>

          <p className="mt-6 mono text-[10px] uppercase tracking-[0.2em] text-white/30">
            {CONTACT_EMAIL}
          </p>
        </div>
      </div>
    </section>
  );
}

function ChannelButton({ href, label, Icon, external }) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      aria-label={label}
      className="flex flex-col items-center gap-2 group"
    >
      <span className="h-14 w-14 flex items-center justify-center border hairline text-white/70 hover:bg-white hover:text-[#050505] transition-colors">
        <Icon size={20} strokeWidth={1.5} />
      </span>
      <span className="mono text-[10px] uppercase tracking-[0.2em] text-white/40 group-hover:text-white transition-colors">
        {label}
      </span>
    </a>
  );
}