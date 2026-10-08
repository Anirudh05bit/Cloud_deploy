function Navbar() {
  return (
    <header className="fixed left-64 right-0 top-0 z-10 h-16 border-b border-slate-200 bg-white">

      <div className="flex h-full items-center justify-between px-8">

        <div>
          <p className="text-sm text-slate-500">
            Cloud deployment platform
          </p>
        </div>

        <div className="flex items-center gap-3">

          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
            A
          </div>

        </div>

      </div>

    </header>
  );
}

export default Navbar;