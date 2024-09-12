"use client"
import type React from 'react'
import { useEffect, useState } from 'react'

interface StockData {
  c: number;
  h: number;
  l: number;
  o: number;
  pc: number;
  t: number;
}

const Welcome: React.FC = () => {
  const [symbol, setSymbol] = useState('')
  const [stockData, setStockData] = useState<StockData | null>(null)
  const [error, setError] = useState('')
  const [isPolling, setIsPolling] = useState(true)

  const fetchStockPrice = async () => {
    setError('')
    setStockData(null)
    const currentTime = new Date().toLocaleTimeString()
    console.log(`Fetching stock price at ${currentTime}`)
    try {
      const response = await fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=crhc1f9r01qrbc71v4cgcrhc1f9r01qrbc71v4d0`)
      if (!response.ok) {
        throw new Error('Failed to fetch stock data')
      }
      const data: StockData = await response.json()
      if (data.c === 0) {
        throw new Error('Invalid stock symbol')
      }
      setStockData({ ...data, fetchTime: currentTime })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null

    if (isPolling) {
      fetchStockPrice() // Fetch immediately
      intervalId = setInterval(fetchStockPrice, 1000)
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId)
      }
    }
  }, [isPolling])

  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-4">Stock Price Checker</h1>
      <div className="mb-4">
        <input
          type="text"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value.toUpperCase())}
          placeholder="Enter stock symbol (e.g., AAPL)"
          className="px-4 py-2 border border-gray-300 rounded-md mr-2 text-black"
        />
        <button
          onClick={fetchStockPrice}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Get Price
        </button>
      </div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {stockData && (
        <div className="bg-gray-100 p-4 rounded-md text-black">
          <h2 className="text-2xl font-bold mb-2 text-black">{symbol}</h2>
          <p className="text-xl">Current Price: <span className="text-green-500">${stockData.c.toFixed(2)}</span></p>
          <p>Open: <span className="text-green-500">${stockData.o.toFixed(2)}</span></p>
          <p>High: <span className="text-green-500">${stockData.h.toFixed(2)}</span></p>
          <p>Low: <span className="text-green-500">${stockData.l.toFixed(2)}</span></p>
          <p>Previous Close: <span className="text-green-500">${stockData.pc.toFixed(2)}</span></p>
        </div>
      )}
    </div>
  )
}

export default Welcome