import { Landing } from '@/pages/Landing'
import LoginPage from '@/pages/Signup'
import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'

import { ContributorDashboard } from '@/pages/dashboards/ContributorDashboard'
import { MaintainerDashboard } from '@/pages/dashboards/MaintainerDashboard'
import { DonatorDashboard } from '@/pages/dashboards/DonatorDashboard'
import { RepositoriesPage } from '@/pages/project/RepositoriesPage'
import { RepositoryDetailsPage } from '@/pages/project/repository-details'
import { GitHubCallback } from '@/pages/GithubCallback'
import { ProjectDetails } from '@/pages/dashboards/ProjectDetails'
import { ContributionDetails } from '@/pages/dashboards/ContributionDetails'

const AppRoutes = () => {
  const [authToken, setAuthToken] = useState<string | null>(null)

  const handleLogout = () => {
    setAuthToken(null)
  }

  return (
    <Routes>
      <Route path="*" element={<Landing />} />
      <Route
        path="/signup"
        element={
          <LoginPage
            authToken={authToken}
            setAuthToken={setAuthToken}
            handleLogout={handleLogout}
          />
        }
      />
      <Route path="/dashboard">
        <Route path="contributor" element={<ContributorDashboard />} />
        <Route path="maintainer" element={<MaintainerDashboard />} />
        <Route path="donator" element={<DonatorDashboard />} />
      </Route>
      <Route path="/repositories/:id" element={<RepositoriesPage />} />
      <Route
        path="/repositories/:id/repo/:repoId"
        element={<RepositoryDetailsPage />}
      />
      <Route path="/github-auth" element={<GitHubCallback />} />
      <Route
        path="/dashboard/maintainer/projects/:projectId"
        element={<ProjectDetails />}
      />
      <Route
        path="/dashboard/contributor/contributions/:contributionId"
        element={<ContributionDetails />}
      />
    </Routes>
  )
}

export default AppRoutes
