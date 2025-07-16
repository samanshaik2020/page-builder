import { useNode, type UserComponent } from "@craftjs/core"

export interface ImageProps {
  src: string
  alt: string
  width: number
  height: number
  objectFit: "cover" | "contain" | "fill" | "none" | "scale-down"
  borderRadius: number
  margin: [number, number, number, number]
}

export const CraftImage: UserComponent<ImageProps> = ({
  src = "/placeholder.svg?height=200&width=300",
  alt = "Image",
  width = 300,
  height = 200,
  objectFit = "cover",
  borderRadius = 0,
  margin = [0, 0, 0, 0],
}) => {
  const {
    connectors: { connect, drag },
    selected,
    actions: { setProp },
  } = useNode((state) => ({
    selected: state.events.selected,
  }))

  return (
    <div
      ref={(ref) => connect(drag(ref!))}
      className={`inline-block ${selected ? "ring-2 ring-blue-500" : ""} cursor-pointer`}
      style={{
        margin: `${margin[0]}px ${margin[1]}px ${margin[2]}px ${margin[3]}px`,
      }}
    >
      <img
        src={src || "/placeholder.svg"}
        alt={alt}
        style={{
          width: `${width}px`,
          height: `${height}px`,
          objectFit,
          borderRadius: `${borderRadius}px`,
          display: "block",
        }}
        className="transition-all"
      />
    </div>
  )
}

CraftImage.craft = {
  displayName: "Image",
  props: {
    src: "/placeholder.svg?height=200&width=300",
    alt: "Image",
    width: 300,
    height: 200,
    objectFit: "cover",
    borderRadius: 0,
    margin: [0, 0, 0, 0],
  },
  related: {
    toolbar: () => import("./ImageToolbar").then((mod) => mod.ImageToolbar),
  },
}
