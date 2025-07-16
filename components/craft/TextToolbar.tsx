"use client"

import { useNode } from "@craftjs/core"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { TextProps } from "./Text"

export const TextToolbar = () => {
  const {
    actions: { setProp },
    props,
  } = useNode((node) => ({
    props: node.data.props as TextProps,
  }))

  return (
    <div className="space-y-4 p-4">
      <div>
        <Label>Font Size</Label>
        <Slider
          value={[props.fontSize]}
          onValueChange={(value) => setProp((props: TextProps) => (props.fontSize = value[0]))}
          max={72}
          min={8}
          step={1}
          className="mt-2"
        />
        <span className="text-sm text-muted-foreground">{props.fontSize}px</span>
      </div>

      <div>
        <Label>Font Weight</Label>
        <Select
          value={props.fontWeight.toString()}
          onValueChange={(value) => setProp((props: TextProps) => (props.fontWeight = Number.parseInt(value)))}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="300">Light</SelectItem>
            <SelectItem value="400">Normal</SelectItem>
            <SelectItem value="500">Medium</SelectItem>
            <SelectItem value="600">Semi Bold</SelectItem>
            <SelectItem value="700">Bold</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Text Color</Label>
        <div className="flex gap-2 mt-2">
          <Input
            type="color"
            value={props.color}
            onChange={(e) => setProp((props: TextProps) => (props.color = e.target.value))}
            className="w-12 h-8 p-1"
          />
          <Input
            value={props.color}
            onChange={(e) => setProp((props: TextProps) => (props.color = e.target.value))}
            placeholder="#000000"
          />
        </div>
      </div>

      <div>
        <Label>Text Align</Label>
        <Select
          value={props.textAlign}
          onValueChange={(value: "left" | "center" | "right") =>
            setProp((props: TextProps) => (props.textAlign = value))
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="left">Left</SelectItem>
            <SelectItem value="center">Center</SelectItem>
            <SelectItem value="right">Right</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Margin (px)</Label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          <Input
            type="number"
            placeholder="Top"
            value={props.margin[0]}
            onChange={(e) => setProp((props: TextProps) => (props.margin[0] = Number.parseInt(e.target.value) || 0))}
          />
          <Input
            type="number"
            placeholder="Right"
            value={props.margin[1]}
            onChange={(e) => setProp((props: TextProps) => (props.margin[1] = Number.parseInt(e.target.value) || 0))}
          />
          <Input
            type="number"
            placeholder="Bottom"
            value={props.margin[2]}
            onChange={(e) => setProp((props: TextProps) => (props.margin[2] = Number.parseInt(e.target.value) || 0))}
          />
          <Input
            type="number"
            placeholder="Left"
            value={props.margin[3]}
            onChange={(e) => setProp((props: TextProps) => (props.margin[3] = Number.parseInt(e.target.value) || 0))}
          />
        </div>
      </div>
    </div>
  )
}
