export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black text-white">

      <h1 className="text-6xl font-bold mb-4">404</h1>

      <p className="text-xl mb-6">
        Este marco no existe.
      </p>

      <a
        href="/sistemas"
        className="bg-blue-600 px-6 py-3 rounded"
      >
        Ir a un marco válido
      </a>

    </div>
  )
}