import { Component } from 'solid-js'
import { cn } from '../../lib/utils'

type NodeEdgeProps = {
	isSelected: boolean
	isNew: boolean
	position: { x0: number; y0: number; x1: number; y1: number }
	onMouseDownEdge: (event: any) => void
	onClickDelete: () => void
}

const NodeEdge: Component<NodeEdgeProps> = (props: NodeEdgeProps) => {
	function handleEdgeMouseDown(event: any) {
		event.stopPropagation()

		props.onMouseDownEdge(event)
	}

	return (
		<svg class='pointer-events-none absolute left-0 top-0 h-[100%] w-[100%]'>
			<path
				class={cn(
					{
						'z-30 !stroke-yellow-500 !stroke-[3]': props.isSelected
					},
					{ '!stroke-emerald-400': props.isNew },
					'pointer-events-none cursor-pointer fill-transparent stroke-amber-500 stroke-2'
				)}
				d={`M ${props.position.x0} ${props.position.y0} C ${
					props.position.x0 +
					Math.abs(props.position.x1 - props.position.x0)
				} ${props.position.y0}, ${
					props.position.x1 -
					Math.abs(props.position.x1 - props.position.x0)
				} ${props.position.y1}, ${props.position.x1} ${
					props.position.y1
				}`}
				onMouseDown={handleEdgeMouseDown}
			/>

          <g>
          </g>
		</svg>
	)
}

export default NodeEdge
