/* eslint-disable @typescript-eslint/no-unused-vars */
import { LiquidityBookServices, MODE } from "@saros-finance/dlmm-sdk";
import { BinLiquidityData,CompositPosition,BinResult } from "./types";
import {PublicKey} from '@solana/web3.js'
import dotenv from 'dotenv';
import path from "path";
import { calculateTokenAmount } from "./utils";
import { tokenName } from "./token";

// Payer wallet
const PAYER = 'add_your_mainet_payer_wallet_here';

// 🎯 WORKSHOP POOL - USDC/USDT
// Add your pools here
const POOL_ADDRESS = "9P3N4QxjMumpTNNdvaNNskXu2t7VHMMXtePQB72kkSAk";

// Shared DLMM service instance
const dlmmService = new LiquidityBookServices({
  mode: MODE.MAINNET,
  options: {
    rpcUrl:
      process.env.NEXT_PUBLIC_RPC_URL || "http://api.mainnet-beta.solana.com",
  },
});

// Summation of all unique posityons
const compositePosition:CompositPosition = {};

// helper function - merges bins from different positions
export const addBinsToCompositePosition = (bin:BinResult,pos:string) => {

  const key = String(bin.binId);
  if (!compositePosition[key]) {
    // First occurrence, initialize
    compositePosition[key] = {
      binId: bin.binId,
      positionAddress: pos,
      isPosition: true,
      reserveX: Number(bin.reserveX),
      reserveY: Number(bin.reserveY),

    };
  } else {
    // Already exists, sum the values
    compositePosition[key].reserveX += Number(bin.reserveX);
    compositePosition[key].reserveY += Number(bin.reserveY);
  }

  return 0;
};

// helper functions we will define
export const fetchPositionInfo = async (poolAddress: string) => {
  try {
    console.log("fetching pool info", poolAddress);
    const poolPubKey = new PublicKey(poolAddress);
    const metadata = await dlmmService.fetchPoolMetadata(poolAddress);

    // Token Mints
    const tokenX = await tokenName(metadata.baseMint);
    const tokenY = await tokenName(metadata.quoteMint);

    // delay
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    //const payer = new PublicKey(process.env.SAROS_POSITION_WALLET || poolAddress);
    
    const payer = new PublicKey(PAYER);
    await delay(400);

    // Token Mints
    const X = new PublicKey(metadata.baseMint);
    const Y = new PublicKey(metadata.quoteMint);

    // Current market price
    let currentMarketPrice = 1;
    const quoteResult = await dlmmService.quote({
        amount: 1000000,
        metadata: metadata,
        optional: {
          isExactInput: true,
          swapForY: true,
          slippage: 0.5
        } 
      }
    );

    currentMarketPrice = calculateTokenAmount(quoteResult.amountOut,metadata.extra.tokenQuoteDecimal);

    const positions = await dlmmService.getUserPositions({
      payer: payer,
      pair: poolPubKey
    });
    await delay(400);

    //Postions Array
    const positionAddresses = positions.map(pos => pos.position);

    // funnction to get bin reserve detail for each position
    const results = await Promise.allSettled(
      positionAddresses.map(async (pos) =>{
        await delay(400);
        let posBins = await dlmmService.getBinsReserveInformation({
          position: new PublicKey(pos),
          pair: poolPubKey,
          payer: payer
        });
        
        // Adding the position address to the response of getBinsReserveInfo
        return {pos,posBins}
      }
      )
    );


    results.forEach((result, idx) => {
      if (result.status === 'fulfilled') {
        //addBinsToCompositePosition(result);
        const {pos,posBins} = result.value;
        posBins.forEach((bin) => addBinsToCompositePosition(bin,pos));
        
        //console.log(`Position ${positionAddresses[idx]} reserves:`, result.value);
      } else {
        console.error(`Position ${positionAddresses[idx].position} failed:`, result.reason);
      }
    });

    const pairAccount = await dlmmService.getPairAccount(poolPubKey);
    await delay(400);
    
    //console.log(compositePosition);

    const activeBin =  pairAccount.activeId;
    console.log("Active bin: ",activeBin);
    const binStep = pairAccount.binStep;
    const activeBinArrayIndex = Math.floor(activeBin/256);

    // All bins - DLMM
    const arrayInfo = await dlmmService.getBinArrayInfo({
      binArrayIndex: activeBinArrayIndex,
      pair: poolPubKey,
      payer: payer
    })

    console.log('pool info sent');
    return {
      positions,
      metadata,
      tokenX,
      tokenY,
      currentMarketPrice,
      activeBin,
      binStep,
      compositePosition,
      ...arrayInfo
    }

  } catch (error) {
    console.error("Error fetching pool data:", error);
    throw error;
  }
  
};

export const getPositionBinLiquidity = async (poolAddress:PublicKey): Promise<BinLiquidityData[]> => {
  try {
    console.log("TODO: getPositionLiquidity");

    const {
      positions,
      metadata,
      tokenX,
      tokenY,
      currentMarketPrice,
      activeBin,
      binStep,
      compositePosition
    } = await fetchPositionInfo(poolAddress.toString());

    const positionLiquidityData: BinLiquidityData[] = [];

    // Extracting key value pairs from the composite position object
    const positionBins =  Object.entries(compositePosition);

    positionBins.forEach(([binId,bin]) => {

      if (bin.reserveX > 0 || bin.reserveY > 0 ) {
        const isActive = binId === activeBin;

        const reserveXAmount = calculateTokenAmount(
          bin.reserveX,
          metadata.extra.tokenBaseDecimal
        );

        const reserveYAmount = calculateTokenAmount(
          bin.reserveY,
          metadata.extra.tokenQuoteDecimal
        );

        const priceDelta = Math.pow(1 + binStep/10000 , Number(binId) - Number(activeBin));
        const binPrice = currentMarketPrice * priceDelta;

        const totalLiquidity = (reserveXAmount * binPrice) + (reserveYAmount / binPrice);

        console.log('bin liquidity sent');
        let binInfo = {
          binId: Number(binId),
          price: binPrice,
          symbolX : tokenX?.symbol || 'tokens',
          symbolY : tokenY?.symbol || 'tokens',
          imageX : tokenX?.image || null,
          imageY : tokenY?.image || null,
          reserveXAmount,
          reserveYAmount,
          totalLiquidity,
          isActive,
          isPosition : bin.isPosition,
          positionAddress: bin.positionAddress
        };

        positionLiquidityData.push(binInfo);
      };
      
    });
    
    return positionLiquidityData;

  } catch (error) {
    console.error("❌ Workshop error:", error);
    return [];
  }
};


export const getPoolBinLiquidity = async (poolAddress:PublicKey): Promise<BinLiquidityData[]> => {
  try {
    console.log("TODO: getPoolLiquidity");

    const {
      metadata,
      tokenX,
      tokenY,
      currentMarketPrice,
      activeBin,
      binStep,
      bins
    } = await fetchPositionInfo(poolAddress.toString());

    const binLiquidityData: BinLiquidityData[] = [];

    bins.forEach(([binId,bin]) => {
      if (bin.reserveX > 0 || bin.reserveY > 0 ) {
        const isActive = binId === activeBin;

        const reserveXAmount = calculateTokenAmount(
          bin.reserveX,
          metadata.extra.tokenBaseDecimal
        );

        const reserveYAmount = calculateTokenAmount(
          bin.reserveY,
          metadata.extra.tokenQuoteDecimal
        );

        const priceDelta = Math.pow(1 + binStep/10000 , Number(binId) - Number(activeBin));
        const binPrice = currentMarketPrice * priceDelta;

        const totalLiquidity = (reserveXAmount * binPrice) + (reserveYAmount / binPrice);

        console.log('bin liquidity sent');
        let binInfo = {
          binId: Number(binId),
          price: binPrice,
          symbolX : tokenX?.symbol || 'tokens',
          symbolY : tokenY?.symbol || 'tokens',
          imageX : tokenX?.image || null,
          imageY : tokenY?.image || null,
          reserveXAmount,
          reserveYAmount,
          totalLiquidity,
          isActive
        };

        binLiquidityData.push(binInfo);
      };
      
    });
     
    return binLiquidityData;

  } catch (error) {
    console.error("❌ Workshop error:", error);
    return [];
  }
};
