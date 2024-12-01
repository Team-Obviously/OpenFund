import { TokenBalance } from '../types/balance'

interface BalanceDisplayProps {
  balance: TokenBalance[]
}

export const BalanceDisplay = ({ balance }: BalanceDisplayProps) => {
  return (
    <div className="flex items-center gap-2">
      {balance.map((token, index) => (
        <div
          key={index}
          className="flex items-center bg-secondary/20 rounded-lg px-3 py-1"
        >
          {token.token_image && (
            <img
              src={token.token_image}
              alt={token.token_name}
              className="w-4 h-4 mr-2"
            />
          )}
          <span className="font-medium">
            {parseFloat(token.quantity).toFixed(4)} {token.token_name}
          </span>
        </div>
      ))}
    </div>
  )
}
