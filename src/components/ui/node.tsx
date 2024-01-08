import { Accessor, Component, For } from 'solid-js'

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
	onMouseDownInputHandler: (
		nodeId: string,
		inputIndex: number,
		positionInputX: number,
		positionInputY: number
	) => void
	onMouseLeave: (nodeId: string, inputIndex: number) => void
}

const Node: Component<NodeProps> = (props: NodeProps) => {
	// Handle use clicking on a node input
	function handleInputMouseEnter(inputRef: any, index: number) {
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
		props.onMouseDownInputHandler(props.nodeId, index, centerX, centerY)
	}

	// Handle mouse leaving a node input
	function handleMouseLeave(index: number) {
		props.onMouseLeave(props.nodeId, index)
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
			class='rounded-md border p-6 shadow-md'
			style={{
				transform: `translate(${props.nodePositionX}px, ${props.nodePositionY}px)`
			}}
			onMouseDown={(e) => {
				e.stopPropagation()
				props.onMouseDownHandler(props.nodeId, e)
			}}
		>
			<div>
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
							></div>
						)
					}}
				</For>
			</div>

			<div>
				<For each={[...Array(Number(props.numberInputs)).keys()]}>
					{(_, index: Accessor<number>) => {
						let outputRef: any = null
						return (
							<div
								ref={outputRef}
								onMouseDown={(e: any) =>
									handleOutputMouseDown(outputRef, e, index())
								}
							></div>
						)
					}}
				</For>
			</div>
		</figure>
	)
}

export default Node
