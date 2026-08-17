import { Link } from "react-router-dom";

export default function PageNotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#050505] text-white gap-4">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-white/60">This page doesn't exist.</p>
      <Link to="/" className="underline text-white/80 hover:text-white">
        Back home
      </Link>
    </div>
  );
}
