export default function DefaultHeader() {
  return (
    <header className="flex justify-between items-center px-8 py-6">
      <span className="text-2xl font-bold tracking-tight text-foreground">
        GAEMAMUSA
      </span>
      <a
        href="https://Gaemamusa.ai"
        className="px-4 py-2 rounded-lg border border-border text-sm font-medium text-foreground bg-card hover:bg-muted transition"
        target="_blank"
        rel="noopener noreferrer"
      >
        Chat with Gaemamusa <span aria-hidden>↗</span>
      </a>
    </header>
  );
}
