import { Card, CardContent } from '@/components/ui/card'

const stats = [
  { label: 'Active Users', value: '100K+' },
  { label: 'Companies', value: '500+' },
  { label: 'Countries', value: '50+' },
  { label: 'Uptime', value: '99.9%' },
]

export const Stats = () => {
  return (
    <div className="py-24 px-6 md:px-12 lg:px-24">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold mb-2">{stat.value}</div>
              <div className="text-muted-foreground">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
