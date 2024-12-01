import { Code2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function Navbar() {
  const navigate = useNavigate()
  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <Code2 className="w-8 h-8 text-purple-600" />
            <span className="font-bold text-xl">OpenSource Rewards</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#" className="text-gray-600 hover:text-purple-600">
              Features
            </a>
            <a href="#" className="text-gray-600 hover:text-purple-600">
              Projects
            </a>
            <a href="#" className="text-gray-600 hover:text-purple-600">
              Community
            </a>
            <button
              onClick={() => navigate('/signup')}
              className="bg-purple-600 text-white px-4 py-2 rounded-full hover:bg-purple-700 transition"
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
