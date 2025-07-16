"use client"

import { useNode } from "@craftjs/core"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { ImageProps } from "./Image"

export const ImageToolbar = () => {
  const {
    actions: { setProp },
    props,
  } = useNode((node) => ({
    props: node.data.props as ImageProps,
  }))

  return (
    <div className="space-y-4 p-4">
      <div>
        <Label>Image URL</Label>
        <Input
          value={props.src}
          onChange={(e) => setProp((props: ImageProps) => (props.src = e.target.value))}
          placeholder="https://example.com/image.jpg"
          className="mt-2"
        />
      </div>

      <div>
        <Label>Alt Text</Label>
        <Input
          value={props.alt}
          onChange={(e) => setProp((props: ImageProps) => (props.alt = e.target.value))}
          className="mt-2"
        />
      </div>

      <div>
        <Label>Width</Label>
        <Slider
          value={[props.width]}
          onValueChange={(value) => setProp((props: ImageProps) => (props.width = value[0]))}
          max={800}
          min={50}
          step={10}
          className="mt-2"
        />
        <span className="text-sm text-muted-foreground">{props.width}px</span>
      </div>

      <div>
        <Label>Height</Label>
        <Slider
          value={[props.height]}
          onValueChange={(value) => setProp((props: ImageProps) => (props.height = value[0]))}
          max={600}
          min={50}
          step={10}
          className="mt-2"
        />
        <span className="text-sm text-muted-foreground">{props.height}px</span>
      </div>

      <div>
        <Label>Object Fit</Label>
        <Select
          value={props.objectFit}
          onValueChange={(value: "cover" | "contain" | "fill" | "none" | "scale-down") =>
            setProp((props: ImageProps) => (props.objectFit = value))
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cover">Cover</SelectItem>
            <SelectItem value="contain">Contain</SelectItem>
            <SelectItem value="fill">Fill</SelectItem>
            <SelectItem value="none">None</SelectItem>
            <SelectItem value="scale-down">Scale Down</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Border Radius</Label>
        <Slider
          value={[props.borderRadius]}
          onValueChange={(value) => setProp((props: ImageProps) => (props.borderRadius = value[0]))}
          max={50}
          min={0}
          step={1}
          className="mt-2"
        />
        <span className="text-sm text-muted-foreground">{props.borderRadius}px</span>
      </div>
    </div>
  )
}
