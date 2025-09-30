"use client";

import { BinDistributionChart } from "@/components/bin-distribution/chart";
import { getBinLiquidity } from "@/lib/position";
import { BinLiquidityData } from "@/lib/types";
import { useEffect, useState } from "react";

export default function LiveWorkshopDemo() {
  const [binData, setBinData] = useState<BinLiquidityData[]>([]);

  const getActiveBinData = async () => {
    const data = await getBinLiquidity();
    setBinData(data);
  };

  useEffect(() => {
    getActiveBinData();
  }, []);

  return (
    <div className="w-full my-auto h-full rounded-lg border border-gray-300">
     <div className="space-y-6 px-4 sm:px-6 rounded-lg">
        <BinDistributionChart binData={binData} />
      </div>
    </div>
  );
}
