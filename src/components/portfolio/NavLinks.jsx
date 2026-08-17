import { useState } from "react";
import { Menu, X } from "lucide-react";

export function NavLinks({ items }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Desktop */}
      <ul className="hidden md:flex items-center gap-6 lg:gap-10">
        {items.map((item) => (
          <li key={item.label}>
            <a
              href={item.href}
              className="group relative mono text-xs tracking-[0.25em] uppercase text-white/70 hover:text-white transition-colors duration-150"
            >
              {item.label}
              <span className="absolute -bottom-1 left-1/2 h-[1px] w-0 bg-white transition-all duration-200 ease-out group-hover:w-full group-hover:left-0" />
            </a>
          </li>
        ))}
      </ul>

      {/* Mobile toggle */}
      <button
        className="md:hidden text-white"
        onClick={() => setOpen((v) => !v)}
        aria-label="Toggle navigation"
        aria-expanded={open}
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile menu */}
      {open && (
        <div className="absolute top-16 inset-x-0 bg-[#050505] border-b hairline md:hidden">
          <ul className="flex flex-col px-6 py-4 gap-4">
            {items.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="mono text-xs tracking-[0.25em] uppercase text-white/70 hover:text-white"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}