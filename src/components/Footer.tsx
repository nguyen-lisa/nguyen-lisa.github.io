export default function Footer() {
  return (
    <footer className="mt-12 border-t border-border py-6">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center px-4 sm:px-6 lg:px-8 gap-4 text-sm text-text/70">
        <p>© {new Date().getFullYear()} Your Name</p>
        <div className="flex gap-4">
        <a href="https://github.com/yourgithub" target="_blank" rel="noreferrer" className="link">GitHub</a>
        <a href="https://linkedin.com/in/yourlinkedin" target="_blank" rel="noreferrer" className="link">LinkedIn</a>
        <a href="mailto:you@email.com" className="link">Email</a>
        </div>
      </div>
    </footer>
  );
}
