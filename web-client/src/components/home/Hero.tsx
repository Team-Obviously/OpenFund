import { Button } from '@/components/ui/button'

export const Hero = () => {
  return (
    <div className="py-24 px-6 md:px-12 lg:px-24 text-center">
      <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6">
        Your Modern Solution for Everything
      </h1>
      <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
        Transform your workflow with our cutting-edge platform. Built for teams
        who demand the best in technology and design.
      </p>
      <div className="flex gap-4 justify-center">
        <Button size="lg">Get Started</Button>
        <Button size="lg" variant="outline">
          Learn More
        </Button>
      </div>
    </div>
  )
}
