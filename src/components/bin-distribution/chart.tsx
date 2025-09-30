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

  // Simple sort by binId - no complex processing needed
  const sortedBinData = [...binData].sort((a, b) => a.binId - b.binId);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h4 className="font-semibold text-base sm:text-lg flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-purple-600" />
            Bin Distribution Chart
          </h4>
        </div>
        <div className="text-xs italic">
          Showing {binData.length} bins with liquidity
        </div>
      </div>

      <ChartContainer config={chartConfig} className="min-h-[300px]">
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

                  const yEntry = payload.find((p:any) => p.dataKey === 'price');

                  return [
                    <div key="content" className="space-y-1">
                      { yEntry && (<>
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
                        </>
                        )}
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
    </div>
  );
}
