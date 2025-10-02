"use client";

import { BinDistributionChart } from "@/components/bin-distribution/chart";
import { getPositionBinLiquidity } from "@/lib/position";
import { BinLiquidityData } from "@/lib/types";
import { useEffect, useState } from "react";
import {PublicKey} from '@solana/web3.js'

export default function LiveWorkshopDemo() {
  const [positionData, setPositionData] = useState<BinLiquidityData[]>([]);

  const POOL_ADDRESS_1 = new PublicKey('9P3N4QxjMumpTNNdvaNNskXu2t7VHMMXtePQB72kkSAk');
  const POOL_ADDRESS_2 = new PublicKey('8f5df1A2pahY3qgrXTSx9jtYnE2idavDv9BK94smB528');

  const pool_address = [POOL_ADDRESS_1,POOL_ADDRESS_2];


  const getPositionBinData = async () => {
    const data = await getPositionBinLiquidity(POOL_ADDRESS_1);
    setPositionData(data);
  };



  useEffect(() => {
    getPositionBinData();
  }, []);

  return (
    <div className="w-full my-auto h-full rounded-lg border border-gray-300">
     <div className="space-y-6 px-4 sm:px-6 rounded-lg">
        <BinDistributionChart binData={positionData} />
        {/*
          pool_address.map((address, index) => (
            <div key={address.toString()} >
              <h3 className="text-lg font-semibold mb-2">
                Pool {index + 1}: {address.toString()}
              </h3>
              <BinDistributionChart binData={positionData} />
            </div>
          ))
        */}
      </div>
    </div>
  );
}
