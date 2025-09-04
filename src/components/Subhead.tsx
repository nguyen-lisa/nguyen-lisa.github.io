export default function Subhead({ children }: { children: React.ReactNode }) {
  return (
    <span className="subhead block text-text/70 text-base md:text-lg">
      {children}
    </span>
  );
}
