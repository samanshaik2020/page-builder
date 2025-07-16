"use client"

import { useNode } from "@craftjs/core"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { ContainerProps } from "./Container"

export const ContainerToolbar = () => {
  const {
    actions: { setProp },
    props,
  } = useNode((node) => ({
    props: node.data.props as ContainerProps,
  }))

  return (
    <div className="space-y-4 p-4">
      <div>
        <Label>Background Color</Label>
        <div className="flex gap-2 mt-2">
          <Input
            type="color"
            value={props.backgroundColor === "transparent" ? "#ffffff" : props.backgroundColor}
            onChange={(e) => setProp((props: ContainerProps) => (props.backgroundColor = e.target.value))}
            className="w-12 h-8 p-1"
          />
          <Input
            value={props.backgroundColor}
            onChange={(e) => setProp((props: ContainerProps) => (props.backgroundColor = e.target.value))}
            placeholder="transparent"
          />
        </div>
      </div>

      <div>
        <Label>Min Height</Label>
        <Slider
          value={[props.minHeight]}
          onValueChange={(value) => setProp((props: ContainerProps) => (props.minHeight = value[0]))}
          max={800}
          min={50}
          step={10}
          className="mt-2"
        />
        <span className="text-sm text-muted-foreground">{props.minHeight}px</span>
      </div>

      <div>
        <Label>Flex Direction</Label>
        <Select
          value={props.flexDirection}
          onValueChange={(value: "row" | "column") => setProp((props: ContainerProps) => (props.flexDirection = value))}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="row">Row</SelectItem>
            <SelectItem value="column">Column</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Justify Content</Label>
        <Select
          value={props.justifyContent}
          onValueChange={(value: any) => setProp((props: ContainerProps) => (props.justifyContent = value))}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="flex-start">Start</SelectItem>
            <SelectItem value="center">Center</SelectItem>
            <SelectItem value="flex-end">End</SelectItem>
            <SelectItem value="space-between">Space Between</SelectItem>
            <SelectItem value="space-around">Space Around</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Align Items</Label>
        <Select
          value={props.alignItems}
          onValueChange={(value: any) => setProp((props: ContainerProps) => (props.alignItems = value))}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="flex-start">Start</SelectItem>
            <SelectItem value="center">Center</SelectItem>
            <SelectItem value="flex-end">End</SelectItem>
            <SelectItem value="stretch">Stretch</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Gap</Label>
        <Slider
          value={[props.gap]}
          onValueChange={(value) => setProp((props: ContainerProps) => (props.gap = value[0]))}
          max={100}
          min={0}
          step={5}
          className="mt-2"
        />
        <span className="text-sm text-muted-foreground">{props.gap}px</span>
      </div>

      <div>
        <Label>Padding (px)</Label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          <Input
            type="number"
            placeholder="Top"
            value={props.padding[0]}
            onChange={(e) =>
              setProp((props: ContainerProps) => (props.padding[0] = Number.parseInt(e.target.value) || 0))
            }
          />
          <Input
            type="number"
            placeholder="Right"
            value={props.padding[1]}
            onChange={(e) =>
              setProp((props: ContainerProps) => (props.padding[1] = Number.parseInt(e.target.value) || 0))
            }
          />
          <Input
            type="number"
            placeholder="Bottom"
            value={props.padding[2]}
            onChange={(e) =>
              setProp((props: ContainerProps) => (props.padding[2] = Number.parseInt(e.target.value) || 0))
            }
          />
          <Input
            type="number"
            placeholder="Left"
            value={props.padding[3]}
            onChange={(e) =>
              setProp((props: ContainerProps) => (props.padding[3] = Number.parseInt(e.target.value) || 0))
            }
          />
        </div>
      </div>
    </div>
  )
}
