import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

function App() {
  const [count, setCount] = useState(5)

  return (
    <div className="flex flex-col items-center text-center p-6 bg-white text-gray-800 dark:bg-gray-900 dark:text-gray-200 transition-colors">
      {/* Logos */}
      <div className="flex gap-6 mb-6">
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="w-20 drop-shadow-xl hover:scale-110 transition" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="w-20 drop-shadow-xl hover:scale-110 transition" alt="React logo" />
        </a>
      </div>

      {/* Título */}
      <h1 className="text-3xl font-bold mb-4">
        prueba de configuracion de proyecto React
      </h1>

      {/* Card */}
      <div className="bg-white dark:bg-gray-800 shadow-lg border dark:border-gray-700 rounded-lg p-6 transition-colors">
        <button
          onClick={() => setCount((count) => count + 2)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          count is {count}
        </button>
        <p className="mt-3">
          Edit <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">src/App.jsx</code> and save to test HMR
        </p>
      </div>



    </div>
  )
}

export default App
