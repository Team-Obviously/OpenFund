import { Navbar } from '@/components/home/Navbar'
import { Hero } from '@/components/home/Hero'
import { Features } from '@/components/home/Features'
import { Stats } from '@/components/home/Stats'
import { CallToAction } from '@/components/home/CallToAction'

export const Landing = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Features />
      <Stats />
      <CallToAction />
    </div>
  )
}
