export default function DefaultFooter() {
  return (
    <footer className="w-full px-8 py-6 border-t border-border flex flex-col md:flex-row items-center justify-between text-xs text-muted-foreground bg-background">
      <span className="font-bold tracking-tight text-foreground">A\\</span>
      <div className="flex gap-4 mt-2 md:mt-0">
        <a href="#" className="hover:underline">
          Product
        </a>
        <a href="#" className="hover:underline">
          Research
        </a>
        <a href="#" className="hover:underline">
          Careers
        </a>
        <a href="#" className="hover:underline">
          Commercial Terms
        </a>
        <a href="#" className="hover:underline">
          Privacy Policy
        </a>
        <a href="#" className="hover:underline">
          Your privacy choices
        </a>
      </div>
    </footer>
  );
}
