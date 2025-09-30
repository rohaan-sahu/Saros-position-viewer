// type used for aggregate pool info and used to display in BinDistributionChart
export interface BinLiquidityData {
  binId: number;
  price: number;
  reserveXAmount: number;
  reserveYAmount: number;
  totalLiquidity: number;
  totalSupply?: string;
  isActive: boolean;
}

/*
pair,positionMint,LiquidityShares,lowerBinId,upperBinId,position,space
*/

export interface BinReserveInfo  {
  binId: number | string;      // The unique identifier for the bin
  reserveX: number ;   // Amount of token X reserved in this bin
  reserveY: number ;   // Amount of token Y reserved in this bin
  liquidityShare?: number | string | BigInt;  // Liquidity amount in this bin (could be shares or raw units)
  binPosition?: number;

  // Optionally, more fields:
  // feeEarnedX?: number | string;
  // feeEarnedY?: number | string;
  // other protocol-specific fields
}

export interface BinResult  {
  binId: number | string;      // The unique identifier for the bin
  reserveX: number | string;   // Amount of token X reserved in this bin
  reserveY: number | string;   // Amount of token Y reserved in this bin
  liquidityShare?: number | string | BigInt;  // Liquidity amount in this bin (could be shares or raw units)
  binPosition?: number;

  // Optionally, more fields:
  // feeEarnedX?: number | string;
  // feeEarnedY?: number | string;
  // other protocol-specific fields
}


export type CompositPosition = {[binId: string]: BinReserveInfo};

export interface tokenDetails {
  image:string;
  name: string;
  symbol: string;
}