"use client"

import { useNode, type UserComponent } from "@craftjs/core"
import { useState } from "react"
import ContentEditable from "react-contenteditable"

export interface TextProps {
  text: string
  fontSize: number
  fontWeight: number
  color: string
  textAlign: "left" | "center" | "right"
  margin: [number, number, number, number] // top, right, bottom, left
  padding: [number, number, number, number]
}

export const Text: UserComponent<TextProps> = ({
  text = "Click to edit text",
  fontSize = 16,
  fontWeight = 400,
  color = "#000000",
  textAlign = "left",
  margin = [0, 0, 0, 0],
  padding = [8, 8, 8, 8],
}) => {
  const {
    connectors: { connect, drag },
    selected,
    actions: { setProp },
  } = useNode((state) => ({
    selected: state.events.selected,
  }))

  const [editable, setEditable] = useState(false)

  return (
    <div
      ref={(ref) => connect(drag(ref!))}
      onClick={() => selected && setEditable(true)}
      className={`${selected ? "ring-2 ring-blue-500" : ""} cursor-pointer transition-all`}
      style={{
        margin: `${margin[0]}px ${margin[1]}px ${margin[2]}px ${margin[3]}px`,
        padding: `${padding[0]}px ${padding[1]}px ${padding[2]}px ${padding[3]}px`,
      }}
    >
      <ContentEditable
        html={text}
        disabled={!editable}
        onChange={(e) => setProp((props: TextProps) => (props.text = e.target.value))}
        onBlur={() => setEditable(false)}
        style={{
          fontSize: `${fontSize}px`,
          fontWeight,
          color,
          textAlign,
          outline: "none",
          minHeight: "1em",
        }}
      />
    </div>
  )
}

Text.craft = {
  displayName: "Text",
  props: {
    text: "Click to edit text",
    fontSize: 16,
    fontWeight: 400,
    color: "#000000",
    textAlign: "left",
    margin: [0, 0, 0, 0],
    padding: [8, 8, 8, 8],
  },
  related: {
    toolbar: () => import("./TextToolbar").then((mod) => mod.TextToolbar),
  },
}
