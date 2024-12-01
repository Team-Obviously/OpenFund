import { Button } from '@/components/ui/button'

export const CallToAction = () => {
  return (
    <div className="py-24 px-6 md:px-12 lg:px-24 bg-muted text-center">
      <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
      <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
        Join thousands of satisfied users who have already transformed their
        workflow.
      </p>
      <Button size="lg">Start Your Free Trial</Button>
    </div>
  )
}
