import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BackButton } from '@/components/ui/back-button'
import { getRequest } from '@/utility/generalServices'
import { Link } from 'react-router-dom'
import { DashboardNav } from '@/components/ui/dashboard-nav'
import { WalletInfo } from '@/components/WalletInfo'

interface Repository {
  _id: string
  name: string
  description: string
  maintainer: string
  organizationName: string
  url: string
  totalDonations: number
  totalAmount: number
  status: 'active' | 'completed'
}

export function ContributorDashboard() {
  const [repositories, setRepositories] = useState<Repository[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await getRequest('/repositories/all')
        console.log('RESONSE:: ', response.data.data.repositories)
        setRepositories(
          Array.isArray(response.data.data.repositories)
            ? response.data.data.repositories
            : []
        )
        setError(null)
      } catch (err) {
        setError('Failed to fetch repositories. Please try again later.')
        console.error('Error fetching data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return <div className="p-6">Loading...</div>
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>
  }

  return (
    <div className="flex flex-col h-screen">
      <DashboardNav />
      <div className="p-6 space-y-6 flex-1">
        <WalletInfo />
        <div className="flex items-center gap-4">
          <BackButton />
          <h1 className="text-2xl font-bold">Available Repositories</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {repositories.map((repo) => (
            <Card key={repo._id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <Link
                    to={repo.url}
                    className="hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <CardTitle>{repo.name}</CardTitle>
                  </Link>
                  <Badge
                    variant={repo.status === 'active' ? 'default' : 'secondary'}
                  >
                    {repo.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {repo.description}
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>Organization:</span>
                    <span className="font-medium">{repo.organizationName}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Total Donations:</span>
                    <span className="font-medium">{repo.totalDonations}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Total Funding:</span>
                    <span className="font-medium">${repo.totalAmount}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {repositories.length === 0 && (
            <div className="text-center py-8 text-muted-foreground col-span-2">
              No repositories available.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
