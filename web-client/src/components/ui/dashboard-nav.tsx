import { Link } from 'react-router-dom'
import { Button } from './button'
import { Separator } from './separator'

export function DashboardNav() {
  return (
    <div className="flex items-center gap-4 px-4 py-2 border-b">
      <Link to="/dashboard/contributor">
        <Button variant="ghost" size="sm">
          Contributor
        </Button>
      </Link>
      <Separator orientation="vertical" className="h-4" />
      <Link to="/dashboard/donator">
        <Button variant="ghost" size="sm">
          Donator
        </Button>
      </Link>
      <Separator orientation="vertical" className="h-4" />
      <Link to="/dashboard/maintainer">
        <Button variant="ghost" size="sm">
          Maintainer
        </Button>
      </Link>
    </div>
  )
}
