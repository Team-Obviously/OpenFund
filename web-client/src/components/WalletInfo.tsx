import { useEffect, useState } from 'react'
import { useOkto } from 'okto-sdk-react'
import { Card, CardContent } from './ui/card'

export function WalletInfo() {
  const { getWallets, getPortfolio } = useOkto()!
  const [wallet, setWallet] = useState<string>('')
  const [portfolio, setPortfolio] = useState<number>(0)

  useEffect(() => {
    const fetchWalletInfo = async () => {
      try {
        const wallets = await getWallets()
        const polygonWallet = wallets.wallets.find(
          (w) => w.network_name === 'BASE'
        )
        if (polygonWallet) {
          setWallet(polygonWallet.address)
        }

        const portfolioData = await getPortfolio()
        console.log(portfolioData.total)
        setPortfolio(portfolioData.total)
        // if (Array.isArray(portfolioData)) {
        //   setPortfolio(portfolioData)
        // } else if (portfolioData && typeof portfolioData === 'object') {
        //   setPortfolio([portfolioData])
        // } else {
        //   setPortfolio([])
        // }
      } catch (error) {
        console.error('Error fetching wallet info:', error)
        setPortfolio(0)
      }
    }

    fetchWalletInfo()
  }, [getWallets, getPortfolio])

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Wallet Address:
            </span>
            <span className="font-mono text-sm">{wallet}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Balance:</span>
            <div className="flex gap-2">
              <span className="text-sm font-medium">
                {portfolio.toFixed(4)} MATIC
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Chain:</span>
            <div className="flex gap-2">
              <span className="text-sm font-medium">Base</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
