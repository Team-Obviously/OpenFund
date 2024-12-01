import { ChevronLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from './button'

export function BackButton() {
  const navigate = useNavigate()

  return (
    <Button
      variant="ghost"
      size="sm"
      className="gap-2"
      onClick={() => navigate(-1)}
    >
      <ChevronLeft className="h-4 w-4" />
      Back
    </Button>
  )
}
