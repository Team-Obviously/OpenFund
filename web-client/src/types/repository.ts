import { ReactNode } from 'react'

export type Repository = {
  id: string
  name: string
  description: string
  stars: number
  forks: number
  contributorsCount: number
  allocatedFunds: number
  language: string
  org: string
  lastUpdated: string
  openIssues: number
  watchers: number
  license: string
  topics: string[]
  visibility: 'public' | 'private'
  defaultBranch: string
  size: number // in KB
  contributors: Contributor[]
}

export type Organization = {
  id: string
  name: string
  description: string
  avatarUrl: string
}

export type Contributor = {
  id: string
  username: string
  avatarUrl: string
  contributions: number
  role: string
}

export type Project = {
  id: string
  name: string
  githubUrl: string
  contributorsCount: number
  fundedAmount: number
}

export type StatItemProps = {
  icon?: ReactNode
  value: number
  label: string
  isCurrency?: boolean
}
