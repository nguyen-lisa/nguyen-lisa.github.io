export default function Footer() {
  return (
    <footer className="mt-10 border-t border-border">
      <div className="mx-auto max-w-4xl px-3 sm:px-4 lg:px-5 py-6
                      flex flex-col items-center justify-center gap-3 text-sm text-text/70">
        <nav className="flex items-center justify-center gap-3">
          <a href="https://www.linkedin.com/in/lisa-nguyen-48825a160/" className="btn btn-outline" target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <a href="https://github.com/nguyen-lisa" className="btn btn-outline" target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a href="mailto:lisanguyen.tech@yahoo.com" className="btn btn-outline">Email</a>
        </nav>
        <p className="text-center">© {new Date().getFullYear()} Lisa Nguyen</p>
      </div>
    </footer>
  );
}
