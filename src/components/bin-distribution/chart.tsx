import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BinLiquidityData } from "@/lib/types";
import { formatNumber } from "@/lib/utils";
import { BarChart3 } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import Image from "next/image";

const chartConfig = {
  totalLiquidity: {
    label: "Liquidity ($)",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;



export function BinDistributionChart({
  binData,
}: {
  binData: BinLiquidityData[];
}) {
  if (binData.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-base sm:text-lg flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-purple-600" />
            Bin Distribution Chart
          </h4>
          <div className="text-xs italic">No data available</div>
        </div>
        <div className="flex items-center justify-center h-64 border border-dashed rounded-lg bg-muted/10">
          <p className="text-muted-foreground text-sm">
            No liquidity data to display
          </p>
        </div>
      </div>
    );
  }

//
const handleZoomIn = () => {
  
};
const handleZoomOut = () => {
  
};

  // Simple sort by binId - no complex processing needed
  const sortedBinData = [...binData].sort((a, b) => a.binId - b.binId);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h4 className="font-semibold text-base sm:text-lg flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-purple-600" />
            {binData[0]?.symbolX}{" - "}{binData[0]?.symbolY}{" "}
            Position Distribution Chart
          </h4>
        </div>
        <div className="text-xs italic">
          Showing {binData.length} bins with liquidity
        </div>
      </div>

      <div className="grid grid-cols-6 lg:grid-cols-9 grid-rows-16 gap-4">
      <div className="col-span-1 lg:col-span-5 row-span-10 border border-gray-300 rounded-lg min-w-[400px] h-[240px] p-4">
        {(binData[0].imageX && binData[0].imageY) && 
          <div className="flex items-center justify-start gap-2">
            <Image 
              src= {binData[0].imageX}
              alt={binData[0].symbolX}
              width={30}
              height={30}
              className="text-blue-500 border-2 border-white/30 rounded-lg"
            />

            <Image 
              src= {binData[0].imageY} 
              alt={binData[0].symbolY}
              width={30}
              height={30}
              className="text-blue-500 border-2 border-white/30 rounded-lg"
            />
          </div>
        }
      <ChartContainer config={chartConfig} className="col-span-1 lg:col-span-2 row-span-4 h-[200px] w-[385px] lg:w-[874px]">
        <BarChart
          accessibilityLayer
          data={sortedBinData}
          margin={{
            top: 20,
            left: 20,
            right: 20,
            bottom: 20,
          }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="price"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => `${value.toFixed(4)}`}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => `$${formatNumber(value)}`}
          />
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                hideLabel
                className="min-w-[200px]"
                formatter={(value, name, props) => {
                  const payload = props.payload;
                  const isActive = payload?.isActive;

                  return [
                    <div key="content" className="space-y-1">
                        <div
                          className={`font-semibold ${isActive ? "text-green-600" : ""}`}
                        >
                          Bin {payload?.binId} {isActive ? "(Active)" : ""}
                        </div>
                        <div className="text-xs space-y-0.5">
                          <div>Bin Price: {payload?.price?.toFixed(4)}</div>
                          <div>
                            Total Liquidity: $
                            {formatNumber(payload?.totalLiquidity)}
                          </div>
                          <div>
                            Base Reserve: {formatNumber(payload?.reserveXAmount)}{" "}
                            {payload?.symbolX}
                          </div>
                          <div>
                            Quote Reserve: {formatNumber(payload?.reserveYAmount)}{" "}
                            {payload?.symbolY}
                          </div>
                          <div>
                            Base Value: $
                            {formatNumber(
                              payload?.reserveXAmount * payload?.price
                            )}
                          </div>
                          <div>
                            Quote Value: ${formatNumber(payload?.reserveYAmount)}
                          </div>
                        </div>
                    </div>,
                  ];
                }}
              />
            }
          />
          <Bar dataKey="reserveYAmount" minPointSize={0.5} stackId="binId" radius={2} fill = "#3b82f6"/>
          <Bar dataKey="reserveXAmount" minPointSize={0.5} stackId="binId" radius={2} fill = "#22c55e"/>
          {/*<ReferenceLine y={0} stroke="#fff" />*/}
        </BarChart>
      </ChartContainer>
       {
          <div className="flex items-center gap-2">
            {/* Zoom Out Button */}
            <button
              onClick={handleZoomOut}
              className="w-10 h-10 rounded-full bg-blue-500 hover:bg-blue-600 text-white font-bold text-xl flex items-center justify-center shadow-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
              aria-label="Zoom out"
            >
              -
            </button>
            
            {/* Zoom In Button */}
            <button
              onClick={handleZoomIn}
              className="w-10 h-10 rounded-full bg-blue-500 hover:bg-blue-600 text-white font-bold text-xl flex items-center justify-center shadow-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
              aria-label="Zoom in"
            >
              +
            </button>
          </div>
      }
      </div>
      </div>
    </div>
  );
}
