export default function ParticlesBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {Array.from({ length: 9 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-0.5 h-0.5 bg-purple-400/60 rounded-full animate-particle"
          style={{
            left: `${(i + 1) * 10}%`,
            animationDelay: `${i * 2}s`,
          }}
        />
      ))}
    </div>
  );
}
