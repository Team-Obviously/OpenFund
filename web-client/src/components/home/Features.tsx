import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Laptop, Shield, Zap } from 'lucide-react'

const features = [
  {
    title: 'Lightning Fast',
    description: 'Built for speed and performance from the ground up.',
    icon: Zap,
  },
  {
    title: 'Secure by Default',
    description: 'Enterprise-grade security at every level.',
    icon: Shield,
  },
  {
    title: 'Easy Integration',
    description: 'Seamlessly integrate with your existing workflow.',
    icon: Laptop,
  },
]

export const Features = () => {
  return (
    <div className="py-24 px-6 md:px-12 lg:px-24 bg-muted">
      <h2 className="text-3xl font-bold text-center mb-12">
        Powerful Features
      </h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature) => (
          <Card key={feature.title}>
            <CardHeader>
              <feature.icon className="w-10 h-10 mb-4 text-primary" />
              <CardTitle>{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
