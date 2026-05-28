export default function FloatingGradients() {
  return (
    <>
      <div className="floating-orb -left-32 top-20 h-96 w-96 bg-primary/20 animate-pulse-glow" />
      <div className="floating-orb -right-32 top-40 h-80 w-80 bg-accent/20 animate-float" />
      <div className="floating-orb bottom-20 left-1/3 h-64 w-64 bg-primary/10 animate-float-delayed" />
    </>
  );
}
