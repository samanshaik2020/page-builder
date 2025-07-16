import { useNode, type UserComponent, useEditor } from "@craftjs/core"
import type { ReactNode } from "react"

export interface ContainerProps {
  children?: ReactNode
  backgroundColor: string
  padding: [number, number, number, number]
  margin: [number, number, number, number]
  minHeight: number
  flexDirection: "row" | "column"
  justifyContent: "flex-start" | "center" | "flex-end" | "space-between" | "space-around"
  alignItems: "flex-start" | "center" | "flex-end" | "stretch"
  gap: number
}

export const Container: UserComponent<ContainerProps> = ({
  children,
  backgroundColor = "transparent",
  padding = [20, 20, 20, 20],
  margin = [0, 0, 0, 0],
  minHeight = 100,
  flexDirection = "column",
  justifyContent = "flex-start",
  alignItems = "flex-start",
  gap = 10,
}) => {
  const {
    connectors: { connect, drag },
    selected,
  } = useNode((state) => ({
    selected: state.events.selected,
  }))

  const { enabled } = useEditor((state) => ({
    enabled: state.options.enabled,
  }))

  return (
    <div
      ref={(ref) => connect(drag(ref!))}
      className={`${selected ? "ring-2 ring-blue-500" : ""} ${enabled ? "cursor-move" : ""} transition-all`}
      style={{
        backgroundColor,
        padding: `${padding[0]}px ${padding[1]}px ${padding[2]}px ${padding[3]}px`,
        margin: `${margin[0]}px ${margin[1]}px ${margin[2]}px ${margin[3]}px`,
        minHeight: `${minHeight}px`,
        display: "flex",
        flexDirection,
        justifyContent,
        alignItems,
        gap: `${gap}px`,
        position: "relative",
      }}
    >
      {children}
    </div>
  )
}

Container.craft = {
  displayName: "Container",
  props: {
    backgroundColor: "transparent",
    padding: [20, 20, 20, 20],
    margin: [0, 0, 0, 0],
    minHeight: 100,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    gap: 10,
  },
  rules: {
    canDrag: () => true,
    canDrop: () => true,
    canMoveIn: () => true,
    canMoveOut: () => true,
  },
  related: {
    toolbar: () => import("./ContainerToolbar").then((mod) => mod.ContainerToolbar),
  },
}
