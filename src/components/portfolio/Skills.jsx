import {
  BrainCircuit,
  Sparkles,
  Bot,
  BarChart3,
  LineChart,
  TrendingUp,
  Code2,
  Cloud,
  ShieldCheck,
  ShieldAlert,
  GitBranch,
  Box,
  Settings,
  Brain,
  Lightbulb,
  Target,
  MessageSquare,
  Zap,
  Globe,
  Megaphone,
  Cog,
  Workflow,
  CircuitBoard,
  Gauge,
  Cpu,
  Activity,
  SlidersHorizontal,
  PenTool,
  Layers,
  Award,
  Linkedin,
} from "lucide-react";

const LINKEDIN_URL = "https://www.linkedin.com/in/darius-nistor-3292783b1";

function SkillItem({ Icon, children }) {
  return (
    <li className="group flex items-center gap-2 border hairline p-2 hover:bg-white/[0.03] transition-colors overflow-hidden">
      <Icon
        size={14}
        strokeWidth={1.5}
        className="text-white/70 group-hover:text-white transition-colors shrink-0"
      />
      <span className="mono text-[10px] uppercase tracking-[0.05em] text-white/70 group-hover:text-white transition-colors leading-tight break-words min-w-0">
        {children}
      </span>
    </li>
  );
}

function GroupCard({ id, title, children }) {
  return (
    <div className="bg-[#050505] p-6 sm:p-8">
      <div className="flex items-center justify-between mb-6 pb-4 border-b hairline">
        <h3 className="mono text-xs uppercase tracking-[0.2em] text-white/80">
          {title}
        </h3>
        <span className="mono text-[10px] text-white/30 tabular-nums">[{id}]</span>
      </div>
      <ul className="grid grid-cols-1 gap-2">{children}</ul>
    </div>
  );
}

function CertificateItem({ id, issuer, children }) {
  return (
    <div className="bg-[#050505] flex items-center gap-4 p-5 sm:p-6 hover:bg-white/[0.03] transition-colors">
      <div className="h-10 w-10 shrink-0 border hairline flex items-center justify-center">
        <Award size={18} strokeWidth={1.5} className="text-white/70" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-heading font-medium text-white text-sm sm:text-base">
          {children}
        </p>
        <p className="mt-1 mono text-[10px] uppercase tracking-[0.15em] text-white/40">
          {issuer}
        </p>
      </div>
      <span className="mono text-[10px] text-white/30 tabular-nums hidden sm:block">
        {id}
      </span>
    </div>
  );
}

function LinkedInButton() {
  return (
    <div className="mt-8 flex justify-center">
      <a
        href={LINKEDIN_URL}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-2 border hairline text-white mono text-xs uppercase tracking-[0.2em] font-medium px-6 py-4 hover:bg-white hover:text-[#050505] transition-colors"
      >
        <Linkedin size={14} strokeWidth={1.5} />
        See more on LinkedIn
        <span>→</span>
      </a>
    </div>
  );
}

export function Skills() {
  return (
    <section id="skills" className="relative bg-transparent border-t hairline scroll-mt-16">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10 py-20 lg:py-28">
        {/* Section header */}
        <div className="flex items-center gap-3 mb-12">
          <span className="mono text-[10px] uppercase tracking-[0.3em] text-white/40">
            [04]
          </span>
          <span className="h-px flex-1 bg-white/10" />
          <span className="mono text-[10px] uppercase tracking-[0.3em] text-white/40">
            SKILLS — CERTIFICATIONS
          </span>
        </div>

        {/* Skill groups */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 border hairline">
          <GroupCard id="01" title="AI & Data">
            <SkillItem Icon={BrainCircuit}>Artificial Intelligence (AI)</SkillItem>
            <SkillItem Icon={Sparkles}>Generative AI</SkillItem>
            <SkillItem Icon={Bot}>Large Language Models (LLMs)</SkillItem>
            <SkillItem Icon={BarChart3}>Data Analysis</SkillItem>
            <SkillItem Icon={LineChart}>Data Visualization</SkillItem>
            <SkillItem Icon={TrendingUp}>Business Intelligence</SkillItem>
            <SkillItem Icon={Code2}>Python</SkillItem>
          </GroupCard>

          <GroupCard id="02" title="Cloud & Security">
            <SkillItem Icon={Cloud}>Amazon Web Services (AWS)</SkillItem>
            <SkillItem Icon={ShieldCheck}>Cybersecurity</SkillItem>
            <SkillItem Icon={ShieldAlert}>Risk Management</SkillItem>
            <SkillItem Icon={GitBranch}>Git & GitHub</SkillItem>
            <SkillItem Icon={Box}>Open Source Software</SkillItem>
          </GroupCard>

          <GroupCard id="03" title="Professional">
            <SkillItem Icon={Settings}>Process Optimization</SkillItem>
            <SkillItem Icon={Brain}>Critical Thinking</SkillItem>
            <SkillItem Icon={Lightbulb}>Problem Solving</SkillItem>
            <SkillItem Icon={Target}>Analytical Thinking</SkillItem>
            <SkillItem Icon={MessageSquare}>Professional Communication</SkillItem>
            <SkillItem Icon={Zap}>AI Productivity Tools (Microsoft 365 Copilot)</SkillItem>
            <SkillItem Icon={Globe}>Web Technologies (HTML)</SkillItem>
            <SkillItem Icon={Megaphone}>Digital Marketing</SkillItem>
          </GroupCard>

          <GroupCard id="04" title="Engineering & Robotics">
            <SkillItem Icon={Cog}>Mechatronics</SkillItem>
            <SkillItem Icon={Zap}>ElectricalEngineering</SkillItem>
            <SkillItem Icon={Workflow}>Automation</SkillItem>
            <SkillItem Icon={Bot}>Robotics</SkillItem>
            <SkillItem Icon={CircuitBoard}>CircuitDesign</SkillItem>
            <SkillItem Icon={Gauge}>Instrumentation</SkillItem>
            <SkillItem Icon={Cpu}>Microcontrollers</SkillItem>
            <SkillItem Icon={Activity}>Sensors</SkillItem>
            <SkillItem Icon={SlidersHorizontal}>ControlSystems</SkillItem>
            <SkillItem Icon={PenTool}>CAD(Computer-Aided Design)</SkillItem>
            <SkillItem Icon={Box}>SolidWorks</SkillItem>
            <SkillItem Icon={Layers}>Fusion360</SkillItem>
          </GroupCard>
        </div>

        <LinkedInButton />

        {/* Certificates */}
        <div className="mt-16">
          <div className="flex items-center gap-3 mb-6">
            <Award size={16} className="text-white/50" strokeWidth={1.5} />
            <h3 className="mono text-xs uppercase tracking-[0.25em] text-white/70">
              Certificates
            </h3>
            <span className="h-px flex-1 bg-white/10" />
            <span className="mono text-[10px] text-white/30 tabular-nums">
              10 VERIFIED
            </span>
          </div>

          <div className="grid sm:grid-cols-2 gap-px bg-white/10 border hairline">
            <CertificateItem id="CRT-01" issuer="Google">
              Google AI Professional Certificate
            </CertificateItem>
            <CertificateItem id="CRT-02" issuer="Google">
              Google AI Essentials Specialization Certificate
            </CertificateItem>
            <CertificateItem id="CRT-03" issuer="Harvard University">
              CS50's Introduction to Programming with Python
            </CertificateItem>
            <CertificateItem id="CRT-04" issuer="Alison">
              Diploma in Mechatronics
            </CertificateItem>
            <CertificateItem id="CRT-05" issuer="CURSA">
              Electrical Engineering Certificate
            </CertificateItem>
            <CertificateItem id="CRT-06" issuer="Microsoft & LinkedIn">
              Career Essentials in Generative AI
            </CertificateItem>
            <CertificateItem id="CRT-07" issuer="HP LIFE">
              AI for Business Professionals
            </CertificateItem>
            <CertificateItem id="CRT-08" issuer="IBM">
              Open Source Foundations
            </CertificateItem>
            <CertificateItem id="CRT-09" issuer="Cambridge International Qualifications / UniAthena">
              Basics of Cyber Law
            </CertificateItem>
            <CertificateItem id="CRT-10" issuer="DataCamp">
              Claude Code 101
            </CertificateItem>
          </div>

          <LinkedInButton />
        </div>
      </div>
    </section>
  );
}