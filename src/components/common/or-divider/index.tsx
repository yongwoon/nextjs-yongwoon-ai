export default function OrDivider() {
  return (
    <div className="flex items-center w-full my-2">
      <div className="flex-1 h-px bg-border" />
      <span className="mx-3 text-muted-foreground text-sm">OR</span>
      <div className="flex-1 h-px bg-border" />
    </div>
  );
}
