import { Component, createEffect, createSignal } from 'solid-js'
import { cn } from '../../lib/utils'
import { CgTrash } from 'solid-icons/cg'

type NodeEdgeProps = {
	isSelected: boolean
	isInsideInput: boolean
	isNew: boolean
	position: { x0: number; y0: number; x1: number; y1: number }
	onMouseDownEdge: (event: any) => void
	onClickDelete: () => void
}

const NodeEdge: Component<NodeEdgeProps> = (props: NodeEdgeProps) => {
	const [middlePoint, setMiddlePoint] = createSignal<{
		x: number
		y: number
	}>({
		x: props.position.x0 + (props.position.x1 - props.position.x0) / 2,
		y: props.position.y0 + (props.position.y1 - props.position.y0) / 2
	})

	// Update the middle point when the position changes
	createEffect(() => {
		const middleX =
			props.position.x0 + (props.position.x1 - props.position.x0) / 2
		const middleY =
			props.position.y0 + (props.position.y1 - props.position.y0) / 2

		setMiddlePoint({
			x: middleX,
			y: middleY
		})
	})

	function handleEdgeMouseDown(event: any) {
		event.stopPropagation()

		props.onMouseDownEdge(event)
	}

	function handleOnClickDelete(event: any) {
		event.stopPropagation()

		props.onClickDelete()
	}

	function calculateOffset(value: number): number {
		return value / 2
	}

	return (
		<svg class={cn('absolute left-0 top-0 h-[100%] w-[100%]')}>
			<path
				class={cn(
					{
						'!stroke-amber-600 !stroke-[3]': props.isSelected
					},
					{ '!stroke-amber-300': props.isNew },
					'cursor-pointer fill-transparent stroke-amber-500 stroke-2'
				)}
				d={`M ${props.position.x0} ${props.position.y0} C ${
					props.position.x0 +
					calculateOffset(Math.abs(props.position.x1 - props.position.x0))
				} ${props.position.y0}, ${
					props.position.x1 -
					calculateOffset(Math.abs(props.position.x1 - props.position.x0))
				} ${props.position.y1}, ${props.position.x1} ${
					props.position.y1
				}`}
				onMouseDown={handleEdgeMouseDown}
			/>

			<g
				class={cn(
					'pointer-events-auto cursor-pointer transition-all duration-500',
					{ 'pointer-events-none opacity-0': !props.isSelected }
				)}
				transform={`translate(${middlePoint().x}, ${
					middlePoint().y - (props.isSelected ? 24 : 0)
				})`}
				onMouseDown={handleOnClickDelete}
			>
            <circle class='fill-red-700' cx='7.5' cy='7.5' r='12' />
				<CgTrash class='flex h-6 w-6 flex-col text-white' />
			</g>
		</svg>
	)
}

export default NodeEdge
