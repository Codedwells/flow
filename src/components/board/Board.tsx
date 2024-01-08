import {
	Accessor,
	Component,
	For,
	Setter,
	createSignal,
	onMount
} from 'solid-js'
import { cn } from '../../lib/utils'
import FlowSettings from '../FlowComponent'
import NodeComponent from '../ui/node'

type TNode = {
	id: string
	numberInputs: number
	numberOutputs: number
	prevPosition: {
		get: Accessor<{ x: number; y: number }>
		set: Setter<{ x: number; y: number }>
	}
	currentPosition: {
		get: Accessor<{ x: number; y: number }>
		set: Setter<{ x: number; y: number }>
	}
	label: string
}

const Board: Component = () => {
	const [isGrabbingBoard, setIsGrabbingBoard] = createSignal<boolean>(false)
	const [scale, setScale] = createSignal<number>(1)
	const [clickPosition, setClickPosition] = createSignal<{
		x: number
		y: number
	}>({ x: -1, y: -1 })
	const [selectedNode, setSelectedNode] = createSignal<string | null>(null)

	// Node signals
	const [nodes, setNodes] = createSignal<TNode[]>([])

	function handleOnMouseDownBoard(event: any) {
		// Deselect the node if any was selected
		setSelectedNode(null)

		// Set grabbing to true
		setIsGrabbingBoard(true)

		setClickPosition({ x: event.x, y: event.y })
	}

	function handleOnMouseUpBoard() {
		// Set grabbing to false
		setIsGrabbingBoard(false)

		// Reset the click position
		setClickPosition({ x: -1, y: -1 })
	}

	function handleOnMouseMoveBoard(event: any) {
		// If user clicked on the board
		if (clickPosition().x >= 0 && clickPosition().y >= 0) {
			// If use is grabbing a node
			if (selectedNode() !== null) {
				const deltaX = event.x - clickPosition().x
				const deltaY = event.y - clickPosition().y

				// Find the clicked node
				const clickedNode = nodes().find(
					(node) => node.id === selectedNode()
				)
				if (clickedNode) {
					// Update the node position
					clickedNode.currentPosition.set({
						x: clickedNode.prevPosition.get().x + deltaX / scale(),
						y: clickedNode.prevPosition.get().y + deltaY / scale()
					})
				}
			} else {
				const deltaX = event.x - clickPosition().x
				const deltaY = event.y - clickPosition().y

				// User is grabbing the board
				const boardWrapper = document.getElementById('boardWrapper')

				if (boardWrapper) {
					boardWrapper.scrollBy(-deltaX, -deltaY)

					// Update the click position
					setClickPosition({ x: event.x, y: event.y })
				}
			}
		}
	}

	onMount(() => {
		const board = document.getElementById('board')

		if (board) {
			board.addEventListener(
				'wheel',
				(e) => {
					// Update the board scale
					setScale(scale() + e.deltaY * -0.005)

					// Restrict the scale to a max of 3 and a min of 1
					setScale(Math.min(Math.max(1, scale()), 3))

					// Apply the scale to the board
					board.style.transform = `scale(${scale()})`
					board.style.marginTop = `${(scale() - 1) * 50}vh`
					board.style.marginLeft = `${(scale() - 1) * 50}vw`
				},
				{ passive: false }
			)
		}
	})

	function handleClickAdd(
		numberInputs: number,
		numberOutputs: number,
		label: string
	) {
		const randomX = Math.floor(Math.random() * (window.innerWidth - 200))
		const randomY = Math.floor(Math.random() * (window.innerHeight - 200))

		// Create signal for the node position
		const [nodePositionPrev, setNodePositionPrev] = createSignal<{
			x: number
			y: number
		}>({ x: randomX, y: randomY })
		const [nodePositionCurrent, setNodePositionCurrent] = createSignal<{
			x: number
			y: number
		}>({ x: randomX, y: randomY })

		// Create a node
		setNodes([
			...nodes(),
			{
				id: `_node${Math.random().toString(36).substring(2, 8)}`,
				numberInputs: numberInputs,
				numberOutputs: numberOutputs,
				prevPosition: {
					get: nodePositionPrev,
					set: setNodePositionPrev
				},
				currentPosition: {
					get: nodePositionCurrent,
					set: setNodePositionCurrent
				},
				label
			}
		])
	}

	function handleClickDelete() {}

	function handleOnMouseDownNode(nodeId: string, event: any) {
		// Set the selected node
		setSelectedNode(nodeId)

		// Update the click position
		setClickPosition({ x: event.x, y: event.y })

		// Find the clicked node
		const clickedNode = nodes().find((node) => node.id === nodeId)

		if (clickedNode) {
			// Update the node position
			clickedNode.prevPosition.set({
				x: clickedNode.currentPosition.get().x,
				y: clickedNode.currentPosition.get().y
			})
		}
	}

	function handleOnMouseDownInput(
		nodeId: string,
		inputIndex: number,
		centerX: number,
		centerY: number
	) {}
	function handleOnMouseDownOutput(
		nodeId: string,
		outputIndex: number,
		centerX: number,
		centerY: number
	) {}
	function handleOnMouseLeave(nodeId: string, inputIndex: number) {}

	return (
		<div id='boardWrapper' class='h-screen w-screen overflow-auto'>
			<FlowSettings
				onClickAdd={handleClickAdd}
				onClickDelete={handleClickDelete}
				showDelete={selectedNode() !== null}
			/>

			<div
				id='board'
				class={cn(
					{ '!cursor-grabbing': isGrabbingBoard() },
					'relative h-screen w-screen cursor-grab bg-gray-400 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] transition-transform duration-300 ease-in-out [background-size:16px_16px]'
				)}
				onMouseDown={handleOnMouseDownBoard}
				onMouseUp={handleOnMouseUpBoard}
				onMouseMove={handleOnMouseMoveBoard}
			>
				<For each={nodes()}>
					{(node) => (
						<NodeComponent
							nodeId={node.id}
							isSelected={selectedNode() === node.id}
							nodePositionX={node.currentPosition.get().x}
							nodePositionY={node.currentPosition.get().y}
							numberInputs={node.numberInputs}
							numberOutputs={node.numberOutputs}
							onMouseDownHandler={handleOnMouseDownNode}
							onMouseDownInputHandler={handleOnMouseDownInput}
							onMouseDownOutputHandler={handleOnMouseDownOutput}
							onMouseLeave={handleOnMouseLeave}
							label={node.label}
						/>
					)}
				</For>
			</div>
		</div>
	)
}

export default Board
