

export default function AdminLayout({ children }) {
  return (
        <main className="min-h-screen bg-gray-50 p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <header className="text-2xl font-bold text-gray-900">
              Super Admin Panel
            </header>
            
          </div>
          <div> {children}</div>
        </main>
  )
}
