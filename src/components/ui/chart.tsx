"use client"

import * as React from "react"
import {
  CartesianGrid,
  Line,
  LineChart,
  Bar,
  BarChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  type TooltipProps,
} from "recharts"
import { cn } from "@/lib/utils"

// Definindo ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent localmente
// para evitar imports circulares e conflitos de declaração.

export type ChartConfig = {
  [k: string]: {
    label?: string
    icon?: React.ComponentType
  } & (
    | { type: "color"; color?: string }
    | { type: "icon"; icon?: React.ComponentType }
  )
}

type ChartContextProps = {
  config: ChartConfig
  payload?: TooltipProps<any, any>["payload"]
  activeItemIndex?: number
  activeItem?: Record<string, unknown>
}

const ChartContext = React.createContext<ChartContextProps | null>(null)

function useChart() {
  const context = React.useContext(ChartContext)

  if (!context) {
    throw new Error("useChart must be used within a <Chart />")
  }

  return context
}

const chartable = new Set([
  Area,
  Bar,
  Line,
  Pie,
  LineChart, // Adicionado para cobrir todos os tipos de gráfico
  BarChart,
  PieChart,
  AreaChart,
])

type ChartContainerProps = React.ComponentProps<"div"> & {
  config: ChartConfig
  children: React.ReactNode
}

const ChartContainer = React.forwardRef<HTMLDivElement, ChartContainerProps>(
  ({ config, className, children, ...props }, ref) => {
    const [activeItemIndex, setActiveItemIndex] = React.useState<
      number | undefined
    >()
    const [payload, setPayload] = React.useState<
      TooltipProps<any, any>["payload"]
    >()
    const [activeItem, setActiveItem] = React.useState<
      Record<string, unknown> | undefined
    >()

    const child = React.Children.toArray(children).find(
      (child) => React.isValidElement(child) && child.type === ResponsiveContainer
    ) as React.ReactElement<React.ComponentProps<typeof ResponsiveContainer>> | undefined

    const charts = React.Children.toArray(
      child?.props.children
    ).filter((child) => React.isValidElement(child) && chartable.has(child.type as any)) // Usando 'as any' para o tipo do componente

    if (!charts.length) {
      return null
    }

    return (
      <ChartContext.Provider
        value={{
          config,
          payload,
          activeItemIndex,
          activeItem,
        }}
      >
        <div
          ref={ref}
          className={cn(
            "flex aspect-video justify-center text-foreground",
            className
          )}
          onMouseLeave={() => setActiveItemIndex(undefined)}
          {...props}
        >
          {React.Children.map(children, (child) => {
            if (React.isValidElement(child)) {
              if (child.type === ResponsiveContainer) {
                return React.cloneElement(child, {
                  children: React.Children.map(child.props.children, (subChild) => {
                    if (React.isValidElement(subChild) && chartable.has(subChild.type as any)) { // Usando 'as any'
                      return React.cloneElement(subChild, {
                        className: cn("has-[.recharts-tooltip-cursor]:cursor-grab", (subChild.props as any)?.className),
                        onMouseEnter: (...args: unknown[]) => {
                          const [payload, index] = args as [
                            Array<Record<string, unknown>> | undefined,
                            number | undefined,
                          ]
                          setActiveItemIndex(index)
                          setPayload(payload)
                          setActiveItem(payload?.[index ?? 0])
                          ;(subChild.props as any)?.onMouseEnter?.(...args)
                        },
                        onMouseLeave: (...args: unknown[]) => {
                          setActiveItemIndex(undefined)
                          setPayload(undefined)
                          setActiveItem(undefined)
                          ;(subChild.props as any)?.onMouseLeave?.(...args)
                        },
                        onClick: (...args: unknown[]) => {
                          const [payload, index] = args as [
                            Array<Record<string, unknown>> | undefined,
                            number | undefined,
                          ]
                          setActiveItemIndex(index)
                          setPayload(payload)
                          setActiveItem(payload?.[index ?? 0])
                          ;(subChild.props as any)?.onClick?.(...args)
                        },
                        data: (props as any).data, // Acessando data de props do ChartContainer
                      })
                    }
                    return subChild
                  }),
                })
              }
            }
            return child
          })}
        </div>
      </ChartContext.Provider>
    )
  }
)
ChartContainer.displayName = "ChartContainer"

const ChartTooltip = ({ ...props }: React.ComponentProps<typeof Tooltip>) => {
  const { activeItem, config, payload } = useChart()

  if (!payload?.length || !activeItem) {
    return null
  }

  const itemConfig = config[activeItem.dataKey as keyof typeof config]

  return (
    <Tooltip
      cursor={false}
      content={({ active, payload, label }) => (
        <ChartTooltipContent
          active={active}
          payload={payload}
          label={label}
          itemConfig={config}
        />
      )}
      {...props}
    />
  )
}

const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof Tooltip> & {
    itemConfig: ChartConfig
  }
>(
  (
    { active, payload, itemConfig, className, ...props },
    ref
  ) => {
    if (!active || !payload || payload.length === 0) {
      return null
    }

    const data = payload[0]?.payload

    return (
      <div
        ref={ref}
        className={cn(
          "grid min-w-[130px] gap-1.5 rounded-lg border border-border bg-background p-3 text-xs shadow-md",
          className
        )}
        {...props}
      >
        {payload.map((item, index) => {
          const key = item.dataKey as keyof typeof itemConfig
          const config = key ? itemConfig[key] : undefined

          return (
            <div
              key={item.dataKey as string}
              className="flex items-center justify-between gap-4"
            >
              {config?.icon && (
                <span className="flex items-center gap-1 text-muted-foreground">
                  <config.icon className="h-3 w-3" />
                </span>
              )}
              <span className="text-muted-foreground">
                {config?.label || item.name}:
              </span>
              <span className="font-mono font-medium text-foreground">
                {item.value?.toLocaleString()}
              </span>
            </div>
          )
        })}
      </div>
    )
  }
)
ChartTooltipContent.displayName = "ChartTooltipContent"

const Chart = ChartContainer // Exportando Chart como ChartContainer para manter a compatibilidade

export {
  Chart,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  useChart,
}