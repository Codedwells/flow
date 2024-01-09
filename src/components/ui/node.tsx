import { cn } from '../../lib/utils'
import { Accessor, Component, For, createSignal } from 'solid-js'

type NodeProps = {
	nodeId: string
	nodePositionX: number
	nodePositionY: number
	numberInputs: number
	numberOutputs: number
	isSelected: boolean
	label: string
	onMouseDownHandler: (nodeId: string, event: any) => void
	onMouseDownOutputHandler: (
		nodeId: string,
		outputIndex: number,
		positionOutputX: number,
		positionOutputY: number
	) => void
	onMouseEnterInputHandler: (
		nodeId: string,
		inputIndex: number,
		positionInputX: number,
		positionInputY: number
	) => void
	onMouseLeaveInputHandler: (nodeId: string, inputIndex: number) => void
}

const NodeComponent: Component<NodeProps> = (props: NodeProps) => {
	const [isGrabbingNode, setIsGrabbingNode] = createSignal<boolean>(false)
	const [hoveredInput, setHoveredInput] = createSignal<number>(-1)

	// Handle use clicking on a node input
	function handleInputMouseEnter(inputRef: any, index: number) {
		//Set the hovered input
		setHoveredInput(index)

		const centerX =
			inputRef.getBoundingClientRect().left +
			Math.abs(
				inputRef.getBoundingClientRect().right -
					inputRef.getBoundingClientRect().left
			) /
				2
		const centerY =
			inputRef.getBoundingClientRect().top +
			Math.abs(
				inputRef.getBoundingClientRect().bottom -
					inputRef.getBoundingClientRect().top
			) /
				2

		// Tell the parent about input being clicked
		props.onMouseEnterInputHandler(props.nodeId, index, centerX, centerY)
	}

	// Handle mouse leaving a node input
	function handleMouseLeave(index: number) {
		// Reset the hovered input
		setHoveredInput(-1)

		props.onMouseLeaveInputHandler(props.nodeId, index)
	}

	// Handle user clicking on a node output
	function handleOutputMouseDown(
		outputRef: any,
		event: any,
		outputIndex: number
	) {
		// Prevent the event from bubbling up to the node
		event.stopPropagation()

		const centerX =
			outputRef.getBoundingClientRect().left +
			Math.abs(
				outputRef.getBoundingClientRect().right -
					outputRef.getBoundingClientRect().left
			) /
				2
		const centerY =
			outputRef.getBoundingClientRect().top +
			Math.abs(
				outputRef.getBoundingClientRect().bottom -
					outputRef.getBoundingClientRect().top
			) /
				2

		// Tell the parent about output being clicked
		props.onMouseDownOutputHandler(
			props.nodeId,
			outputIndex,
			centerX,
			centerY
		)
	}
	return (
		<figure
			class={cn(
				{ 'border-sky-500': props.isSelected },
				{ 'cursor-grabbing': isGrabbingNode() },
				'absolute z-[40] h-[6rem] w-[11rem] rounded-md border bg-white p-2 shadow-lg'
			)}
			style={{
				transform: `translate(${props.nodePositionX}px, ${props.nodePositionY}px)`
			}}
			onMouseDown={(e) => {
				e.stopPropagation()
				setIsGrabbingNode(true)
				props.onMouseDownHandler(props.nodeId, e)
			}}
			onMouseUp={() => setIsGrabbingNode(false)}
		>
			<div class='pointer-events-none absolute -left-5 top-0 z-50 flex h-full flex-col items-center justify-center gap-2'>
				<For each={[...Array(Number(props.numberInputs)).keys()]}>
					{(_, index: Accessor<number>) => {
						let inputRef: any = null
						return (
							<div
								ref={inputRef}
								onMouseEnter={() =>
									handleInputMouseEnter(inputRef, index())
								}
								onMouseLeave={() => handleMouseLeave(index())}
								class='pointer-events-auto h-3 w-3 rounded-full bg-emerald-500'
							/>
						)
					}}
				</For>
			</div>

			<p class='flex h-full cursor-pointer select-none items-center w-full justify-center truncate rounded bg-sky-50 text-2xl font-bold'>
				{props.label}
			</p>

			<div class='pointer-events-none absolute -right-5 top-0 z-50 flex h-full flex-col items-center justify-center gap-2'>
				<For each={[...Array(Number(props.numberOutputs)).keys()]}>
					{(_, index: Accessor<number>) => {
						let outputRef: any = null
						const isHovered = hoveredInput() === index()
						return (
							<div
								ref={outputRef}
								onMouseDown={(e: any) =>
									handleOutputMouseDown(outputRef, e, index())
								}
								class={cn(
									{ '!bg-sky-400': isHovered },
									'pointer-events-auto h-3 w-3 cursor-crosshair rounded-full bg-amber-500'
								)}
							/>
						)
					}}
				</For>
			</div>
		</figure>
	)
}

export default NodeComponent
