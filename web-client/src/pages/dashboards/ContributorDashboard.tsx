import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getRequest, postRequest } from '@/utility/generalServices'
import { Link } from 'react-router-dom'
import { DashboardNav } from '@/components/ui/dashboard-nav'
import { WalletInfo } from '@/components/WalletInfo'
import { Issue } from '@/types/maintainer'

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

  const [myContributions, setMyContributions] = useState<Issue[]>([])

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

  useEffect(() => {
    const fetchMyContributions = async () => {
      const userId = JSON.parse(localStorage.getItem('user') || '{}')._id
      if (userId) {
        const response = await postRequest('/issues/contributed', {
          userId: '674d44b173ec28f3978ca589',
        })
        setMyContributions(response.data.data.issues)
      }
    }
    fetchMyContributions()
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Total Contributions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{myContributions.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Total Earnings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                $
                {myContributions.reduce(
                  (sum, issue) => sum + (issue.amount || 0),
                  0
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">My Contributions</h2>
          <div className="grid grid-cols-1 gap-4">
            {myContributions.map((contribution) => (
              <Card key={contribution.htmlUrl}>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {contribution.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Status:
                      </span>
                      <Badge>{contribution.status}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Bounty:
                      </span>
                      <span>${contribution.amount || 0}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {myContributions.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No contributions yet.
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Available Repositories</h2>
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
                      variant={
                        repo.status === 'active' ? 'default' : 'secondary'
                      }
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
                      <span className="font-medium">
                        {repo.organizationName}
                      </span>
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
    </div>
  )
}
