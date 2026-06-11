interface PoweredByFooterProps {
  className?: string;
  linkClassName?: string;
}

export function PoweredByFooter({ className = "", linkClassName = "" }: PoweredByFooterProps) {
  const year = new Date().getFullYear();
  return (
    <p className={`text-xs ${className}`}>
      © {year} Todo Terramar - powered by{" "}
      <a
        href="https://quantumaltus.com"
        target="_blank"
        rel="noopener noreferrer"
        className={`font-semibold hover:underline transition-colors ${linkClassName}`}
      >
        Quantum Altus
      </a>
    </p>
  );
}
