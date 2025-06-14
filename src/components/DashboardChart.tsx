
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart"

interface DashboardChartProps {
  data: { name: string; Faturamento: number }[];
}

const chartConfig = {
  Faturamento: {
    label: "Faturamento",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

export const DashboardChart = ({ data }: DashboardChartProps) => {
  return (
    <Card className="glass-card border-0 shadow-lg animate-slide-up bg-white/50 dark:bg-black/50 backdrop-blur-xl">
      <CardHeader>
        <CardTitle>Visão Geral do Faturamento</CardTitle>
        <CardDescription>Faturamento dos últimos 6 meses</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
            <BarChart data={data} accessibilityLayer>
                <CartesianGrid vertical={false} />
                <XAxis
                    dataKey="name"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                />
                <YAxis
                    tickFormatter={(value) => `R$${value}`}
                    tickLine={false}
                    axisLine={false}
                    tickMargin={10}
                    width={80}
                />
                <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent 
                        formatter={(value) => typeof value === 'number' ? `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : value}
                    />}
                />
                <Bar dataKey="Faturamento" fill="var(--color-Faturamento)" radius={4} />
            </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
