"use client"

import * as React from "react"
import * as RechartsPrimitive from "recharts"

import { cn } from "@/lib/utils"

// Format: { THEME_NAME: { color: CSS_COLOR_VAR, ... } }
const COLOR_PAYLOAD = {
  red: {
    stroke: "hsl(var(--chart-1))",
    fill: "hsl(var(--chart-1))",
  },
  blue: {
    stroke: "hsl(var(--chart-2))",
    fill: "hsl(var(--chart-2))",
  },
  green: {
    stroke: "hsl(var(--chart-3))",
    fill: "hsl(var(--chart-3))",
  },
  orange: {
    stroke: "hsl(var(--chart-4))",
    fill: "hsl(var(--chart-4))",
  },
  yellow: {
    stroke: "hsl(var(--chart-5))",
    fill: "hsl(var(--chart-5))",
  },
}

type ChartConfig = {
  [k: string]: {
    label?: string
    color?: keyof typeof COLOR_PAYLOAD
    icon?: React.ComponentType<{ className?: string }>
  }
}

type ChartContextProps = {
  config: ChartConfig
} & (
  | {
      payload: RechartsPrimitive.TooltipProps<any, any>["payload"]
      activeItemIndex: number
      activeItem?: Record<string, any>
    }
  | {
      payload?: never
      activeItemIndex?: never
      activeItem?: never
    }
)

const ChartContext = React.createContext<ChartContextProps | null>(null)

function useChart() {
  const context = React.useContext(ChartContext)
  if (!context) {
    throw new Error("useChart must be used within a <Chart />")
  }
  return context
}

type ChartProps = {
  config: ChartConfig
  children: React.ReactNode // Pode ser um único elemento ou um array
} & React.ComponentPropsWithoutRef<typeof RechartsPrimitive.ResponsiveContainer>

const Chart = React.forwardRef<
  HTMLDivElement,
  ChartProps & React.ComponentPropsWithoutRef<"div">
>(({ config, children, className, ...props }, ref) => {
  const [activeItemIndex, setActiveItemIndex] = React.useState<number>()
  const [payload, setPayload] =
    React.useState<RechartsPrimitive.TooltipProps<any, any>["payload"]>()
  const [activeItem, setActiveItem] = React.useState<Record<string, any>>()

  // Garante que apenas um filho seja passado para ResponsiveContainer
  const clonedChild = React.useMemo(() => {
    const child = React.Children.only(children); // Espera um único filho
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {
        activeItemIndex,
        setActiveItemIndex,
        payload,
        setPayload,
        setActiveItem,
      });
    }
    return child; // Retorna o filho original se não for um elemento válido
  }, [activeItemIndex, children, payload, setActiveItemIndex, setPayload, setActiveItem]);

  return (
    <ChartContext.Provider
      value={{
        config,
        payload: payload,
        activeItemIndex: activeItemIndex,
        activeItem: activeItem,
      }}
    >
      <div
        ref={ref}
        className={cn("h-full w-full", className)}
        {...props}
      >
        <RechartsPrimitive.ResponsiveContainer {...props}>
          {clonedChild} {/* Passa o filho único e clonado */}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  )
})
Chart.displayName = "Chart"

const ChartTooltip = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div"> &
    RechartsPrimitive.TooltipProps<any, any> & {
      hideIndicator?: boolean
      is?(value: any): boolean
    }
>(
  (
    {
      active,
      payload,
      className,
      coordinate,
      label,
      formatter,
      hideIndicator,
      is,
      ...props
    },
    ref
  ) => {
    const { config } = useChart()

    if (!active || !payload?.length) {
      return null
    }

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-lg border bg-background px-3 py-2 text-sm shadow-md",
          className
        )}
        {...props}
      >
        <p className="text-sm text-muted-foreground">{label}</p>
        {payload.map((item: any) => {
          const key = item.dataKey as keyof typeof config
          const indicatorColor = COLOR_PAYLOAD[config[key]?.color || "blue"]

          return (
            <div
              key={item.dataKey}
              className="flex items-center justify-between space-x-2"
            >
              <div className="flex items-center gap-2">
                {!hideIndicator && (
                  <span
                    className={cn("h-3 w-3 shrink-0 rounded-full", item.color)}
                    style={{
                      backgroundColor: indicatorColor.fill,
                    }}
                  />
                )}
                {config[key]?.label ? config[key]?.label : item.dataKey}:
              </div>
              <span className="font-medium">
                {formatter
                  ? formatter(item.value, item.name, item, item.index, payload)
                  : item.value}
              </span>
            </div>
          )
        })}
      </div>
    )
  }
)
ChartTooltip.displayName = "ChartTooltip"

const ChartLegend = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div"> &
    RechartsPrimitive.LegendProps & {
      is?(value: any): boolean
    }
>(({ className, is, ...props }, ref) => {
  const { config } = useChart()

  return (
    <div
      ref={ref}
      className={cn(
        "flex flex-wrap items-center justify-center gap-4",
        className
      )}
      {...props}
    >
      {props.payload?.map((item: any) => {
        const key = item.dataKey as keyof typeof config
        const indicatorColor = COLOR_PAYLOAD[config[key]?.color || "blue"]

        return (
          <div
            key={item.value}
            className={cn(
              "flex items-center gap-1.5",
              item.inactive && "opacity-50"
            )}
          >
            <span
              className={cn("h-3 w-3 shrink-0 rounded-full", item.color)}
              style={{
                backgroundColor: indicatorColor.fill,
              }}
            />
            <span>{config[key]?.label ? config[key]?.label : item.value}</span>
          </div>
        )
      })}
    </div>
  )
})
ChartLegend.displayName = "ChartLegend"

export { Chart, ChartTooltip, ChartLegend, useChart }