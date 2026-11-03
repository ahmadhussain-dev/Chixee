// Brand icons for the footer and contact page.
const PATHS = {
  facebook: (
    <path fill="currentColor" d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12Z" />
  ),
  instagram: (
    <g fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </g>
  ),
  whatsapp: (
    <g fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3.5 20.5 4.8 16A8.6 8.6 0 1 1 8 19.3l-4.5 1.2Z" />
      <path fill="currentColor" stroke="none" d="M9.2 7.6c-.2-.4-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.3.3-.9.9-.9 2.2s.9 2.5 1 2.7c.1.2 1.8 2.9 4.5 4 2.2.9 2.7.7 3.2.7.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.2-.2-.5-.3l-1.7-.8c-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1-.3-.1-1.1-.4-2-1.2-.8-.7-1.3-1.5-1.4-1.8-.2-.3 0-.4.1-.5l.4-.5.3-.4v-.5l-.8-1.9Z" />
    </g>
  ),
};

export const SOCIAL_STYLE = {
  facebook: "bg-[#1877F2] text-white",
  instagram: "bg-[linear-gradient(45deg,#F58529,#DD2A7B_50%,#8134AF_80%,#515BD4)] text-white",
  whatsapp: "bg-[#25D366] text-white",
};

export default function SocialIcon({ name, className = "size-[22px]" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      {PATHS[name]}
    </svg>
  );
}
