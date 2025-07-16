"use client"

import { useNode } from "@craftjs/core"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import type { ButtonProps } from "./Button"

export const ButtonToolbar = () => {
  const {
    actions: { setProp },
    props,
  } = useNode((node) => ({
    props: node.data.props as ButtonProps,
  }))

  return (
    <div className="space-y-4 p-4">
      <div>
        <Label>Button Text</Label>
        <Input
          value={props.text}
          onChange={(e) => setProp((props: ButtonProps) => (props.text = e.target.value))}
          className="mt-2"
        />
      </div>

      <div>
        <Label>Link URL</Label>
        <Input
          value={props.href}
          onChange={(e) => setProp((props: ButtonProps) => (props.href = e.target.value))}
          placeholder="https://example.com"
          className="mt-2"
        />
      </div>

      <div>
        <Label>Background Color</Label>
        <div className="flex gap-2 mt-2">
          <Input
            type="color"
            value={props.backgroundColor}
            onChange={(e) => setProp((props: ButtonProps) => (props.backgroundColor = e.target.value))}
            className="w-12 h-8 p-1"
          />
          <Input
            value={props.backgroundColor}
            onChange={(e) => setProp((props: ButtonProps) => (props.backgroundColor = e.target.value))}
          />
        </div>
      </div>

      <div>
        <Label>Text Color</Label>
        <div className="flex gap-2 mt-2">
          <Input
            type="color"
            value={props.color}
            onChange={(e) => setProp((props: ButtonProps) => (props.color = e.target.value))}
            className="w-12 h-8 p-1"
          />
          <Input
            value={props.color}
            onChange={(e) => setProp((props: ButtonProps) => (props.color = e.target.value))}
          />
        </div>
      </div>

      <div>
        <Label>Font Size</Label>
        <Slider
          value={[props.fontSize]}
          onValueChange={(value) => setProp((props: ButtonProps) => (props.fontSize = value[0]))}
          max={32}
          min={10}
          step={1}
          className="mt-2"
        />
        <span className="text-sm text-muted-foreground">{props.fontSize}px</span>
      </div>

      <div>
        <Label>Border Radius</Label>
        <Slider
          value={[props.borderRadius]}
          onValueChange={(value) => setProp((props: ButtonProps) => (props.borderRadius = value[0]))}
          max={50}
          min={0}
          step={1}
          className="mt-2"
        />
        <span className="text-sm text-muted-foreground">{props.borderRadius}px</span>
      </div>

      <div>
        <Label>Padding (px)</Label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          <Input
            type="number"
            placeholder="Top"
            value={props.padding[0]}
            onChange={(e) => setProp((props: ButtonProps) => (props.padding[0] = Number.parseInt(e.target.value) || 0))}
          />
          <Input
            type="number"
            placeholder="Right"
            value={props.padding[1]}
            onChange={(e) => setProp((props: ButtonProps) => (props.padding[1] = Number.parseInt(e.target.value) || 0))}
          />
          <Input
            type="number"
            placeholder="Bottom"
            value={props.padding[2]}
            onChange={(e) => setProp((props: ButtonProps) => (props.padding[2] = Number.parseInt(e.target.value) || 0))}
          />
          <Input
            type="number"
            placeholder="Left"
            value={props.padding[3]}
            onChange={(e) => setProp((props: ButtonProps) => (props.padding[3] = Number.parseInt(e.target.value) || 0))}
          />
        </div>
      </div>
    </div>
  )
}
