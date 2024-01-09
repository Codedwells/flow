import {
	Accessor,
	Component,
	For,
	Setter,
	createEffect,
	createSignal,
	onMount
} from 'solid-js'
import { cn } from '../../lib/utils'
import FlowSettings from '../FlowComponent'
import NodeComponent from '../ui/node'
import NodeEdge from '../ui/edge'

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
	inputEdgeIds: { get: Accessor<string[]>; set: Setter<string[]> }
	outputEdgeIds: { get: Accessor<string[]>; set: Setter<string[]> }
	label: string
}

type Edge = {
	id: string
	nodeStartId: string
	nodeEndId: string
	inputIndex: number
	outputIndex: number
	prevStartPosition: {
		get: Accessor<{ x: number; y: number }>
		set: Setter<{ x: number; y: number }>
	}
	currStartPosition: {
		get: Accessor<{ x: number; y: number }>
		set: Setter<{ x: number; y: number }>
	}
	prevEndPosition: {
		get: Accessor<{ x: number; y: number }>
		set: Setter<{ x: number; y: number }>
	}
	currEndPosition: {
		get: Accessor<{ x: number; y: number }>
		set: Setter<{ x: number; y: number }>
	}
}

const Board: Component = () => {
	const [isGrabbingBoard, setIsGrabbingBoard] = createSignal<boolean>(false)
	const [scale, setScale] = createSignal<number>(1)
	const [clickPosition, setClickPosition] = createSignal<{
		x: number
		y: number
	}>({ x: -1, y: -1 })
	const [selectedNode, setSelectedNode] = createSignal<string | null>(null)
	const [selectedEdge, setSelectedEdge] = createSignal<string | null>(null)

	const [isInsideInput, setIsInsideInput] = createSignal<{
		nodeId: string
		inputIndex: number
		positionX: number
		positionY: number
	} | null>(null)

	const [newEdge, setNewEdge] = createSignal<Edge | null>(null)
	const [nodes, setNodes] = createSignal<TNode[]>([])
	const [edges, setEdges] = createSignal<Edge[]>([])

	function handleOnMouseDownBoard(event: any) {
		// Deselect the node if any was selected
		setSelectedNode(null)

		// Deselect the edge if any was selected
		setSelectedEdge(null)

		// Set grabbing to true
		setIsGrabbingBoard(true)

		setClickPosition({ x: event.x, y: event.y })
	}

	function handleOnMouseUpBoard() {
		// Set grabbing to false
		setIsGrabbingBoard(false)

		// Reset the click position
		setClickPosition({ x: -1, y: -1 })

		if (newEdge() !== null && isInsideInput() === null) {
			setNewEdge(null)
		} else if (
			newEdge() !== null &&
			isInsideInput() !== null &&
			isInsideInput()!.nodeId !== newEdge()!.nodeStartId
		) {
			const nodeStartId = newEdge()!.nodeStartId
			const nodeEndId = isInsideInput()!.nodeId

			const nodeStart = nodes().find((node) => node.id === nodeStartId)
			const nodeEnd = nodes().find((node) => node.id === nodeEndId)

			const boardWrapper = document.getElementById('boardWrapper')

			if (nodeStart && nodeEnd && boardWrapper) {
				nodeStart.outputEdgeIds.set([
					...nodeStart.outputEdgeIds.get(),
					`_edge_${nodeStart.id}_${newEdge()!.outputIndex}_${
						nodeEnd.id
					}_${isInsideInput()!.inputIndex}`
				])
				nodeEnd.inputEdgeIds.set([
					...nodeEnd.inputEdgeIds.get(),
					`_edge_${nodeStart.id}_${newEdge()!.outputIndex}_${
						nodeEnd.id
					}_${isInsideInput()!.inputIndex}`
				])

				newEdge()!.prevStartPosition.set((prev) => {
					return {
						x:
							(newEdge()!.currStartPosition.get().x +
								boardWrapper!.scrollLeft) /
							scale(),
						y:
							(newEdge()!.currStartPosition.get().y +
								boardWrapper!.scrollTop) /
							scale()
					}
				})

				newEdge()!.prevEndPosition.set((prev) => {
					return {
						x:
							(isInsideInput()!.positionX +
								boardWrapper!.scrollLeft) /
							scale(),
						y:
							(isInsideInput()!.positionY +
								boardWrapper!.scrollTop) /
							scale()
					}
				})

				newEdge()!.currEndPosition.set((prev) => {
					return {
						x:
							(isInsideInput()!.positionX +
								boardWrapper!.scrollLeft) /
							scale(),
						y:
							(isInsideInput()!.positionY +
								boardWrapper!.scrollTop) /
							scale()
					}
				})

				// Add the edge to the list of edges
				setEdges([
					...edges(),
					{
						...newEdge()!,
						id: `_edge_${nodeStart.id}_${newEdge()!.outputIndex}_${
							nodeEnd.id
						}_${isInsideInput()!.inputIndex}`,
						nodeEndId: nodeEnd.id,
						nodeEndIndex: isInsideInput()!.inputIndex
					}
				])

				setNewEdge(null)
			}
		}
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

					// Update the input edges position on node move
					clickedNode.inputEdgeIds.get().forEach((edgeId) => {
						const edge = edges().find((edge) => edge.id === edgeId)

						if (edge) {
							edge.currEndPosition.set({
								x:
									(edge.prevEndPosition.get().x + deltaX) /
									scale(),
								y:
									(edge.prevEndPosition.get().y + deltaY) /
									scale()
							})
						}
					})

					// Update the output edges position on node move
					clickedNode.outputEdgeIds.get().forEach((edgeId) => {
						const edge = edges().find((edge) => edge.id === edgeId)

						if (edge) {
							edge.currStartPosition.set({
								x:
									(edge.prevStartPosition.get().x + deltaX) /
									scale(),
								y:
									(edge.prevStartPosition.get().y + deltaY) /
									scale()
							})
						}
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

		// Use is setting a new edge
		if (newEdge() !== null) {
			const boardWrapper = document.getElementById('boardWrapper')

			if (boardWrapper) {
				newEdge()!.currEndPosition.set({
					x: (event.x + boardWrapper.scrollLeft) / scale(),
					y: (event.y + boardWrapper.scrollTop) / scale()
				})
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
		const [inputEdgeIds, setInputEdgeIds] = createSignal<string[]>([])
		const [outputEdgeIds, setOutputEdgeIds] = createSignal<string[]>([])

		// Create a node
		setNodes([
			...nodes(),
			{
				id: `_node${Math.random().toString(36).substring(2, 22)}`,
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
				inputEdgeIds: {
					get: inputEdgeIds,
					set: setInputEdgeIds
				},
				outputEdgeIds: {
					get: outputEdgeIds,
					set: setOutputEdgeIds
				},
				label
			}
		])
	}

	function handleClickDelete() {
		// Filter out the selected node
		const filteredNodes = nodes().filter(
			(node) => node.id !== selectedNode()
		)

		// Update the nodes
		setNodes(filteredNodes)
	}

	function handleOnMouseDownNode(nodeId: string, event: any) {
		// Set the selected node
		setSelectedNode(nodeId)

		// Deselect the edge if any was selected
		setSelectedEdge(null)

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

			// Update the input edges position on node move
			clickedNode.inputEdgeIds.get().forEach((edgeId) => {
				const edge = edges().find((edge) => edge.id === edgeId)

				if (edge) {
					edge.prevEndPosition.set({
						x: edge.currEndPosition.get().x * scale(),
						y: edge.currEndPosition.get().y * scale()
					})
				}
			})

			// Update the output edges position on node move
			clickedNode.outputEdgeIds.get().forEach((edgeId) => {
				const edge = edges().find((edge) => edge.id === edgeId)

				if (edge) {
					edge.prevStartPosition.set({
						x: edge.currStartPosition.get().x * scale(),
						y: edge.currStartPosition.get().y * scale()
					})
				}
			})
		}
	}

	function handleOnMouseEnterInput(
		nodeId: string,
		inputIndex: number,
		inputPositionX: number,
		inputPositionY: number
	) {
		setIsInsideInput({
			nodeId,
			inputIndex,
			positionX: inputPositionX,
			positionY: inputPositionY
		})
	}

	function handleOnMouseLeaveInput(nodeId: string, inputIndex: number) {
		if (
			isInsideInput() !== null &&
			isInsideInput()!.nodeId === nodeId &&
			isInsideInput()!.inputIndex === inputIndex
		) {
			return setIsInsideInput(null)
		}
	}

	function handleOnMouseDownOutput(
		nodeId: string,
		outputIndex: number,
		outputPositionX: number,
		outputPositionY: number
	) {
		// Deselect the node if any was selected
		setSelectedNode(null)

		const boardWrapper = document.getElementById('boardWrapper')

		if (boardWrapper) {
			const [prevEdgeStartPosition, setPrevEdgeStartPosition] =
				createSignal<{
					x: number
					y: number
				}>({
					x: (outputPositionX + boardWrapper.scrollLeft) / scale(),
					y: (outputPositionY + boardWrapper.scrollTop) / scale()
				})
			const [currEdgeStartPosition, setCurrEdgeStartPosition] =
				createSignal<{
					x: number
					y: number
				}>({
					x: (outputPositionX + boardWrapper.scrollLeft) / scale(),
					y: (outputPositionY + boardWrapper.scrollTop) / scale()
				})
			const [prevEdgeEndPosition, setPrevEdgeEndPosition] = createSignal<{
				x: number
				y: number
			}>({
				x: (outputPositionX + boardWrapper.scrollLeft) / scale(),
				y: (outputPositionY + boardWrapper.scrollTop) / scale()
			})

			const [currEdgeEndPosition, setCurrEdgeEndPosition] = createSignal<{
				x: number
				y: number
			}>({
				x: (outputPositionX + boardWrapper.scrollLeft) / scale(),
				y: (outputPositionY + boardWrapper.scrollTop) / scale()
			})

			// create a new edge
			setNewEdge({
				id: '',
				outputIndex: outputIndex,
				nodeStartId: nodeId,
				nodeEndId: '',
				inputIndex: -1,
				prevStartPosition: {
					get: prevEdgeStartPosition,
					set: setPrevEdgeStartPosition
				},
				currStartPosition: {
					get: currEdgeStartPosition,
					set: setCurrEdgeStartPosition
				},
				prevEndPosition: {
					get: prevEdgeEndPosition,
					set: setPrevEdgeEndPosition
				},
				currEndPosition: {
					get: currEdgeEndPosition,
					set: setCurrEdgeEndPosition
				}
			})
		}
	}

	// Handle user clicking on an edge
	function handleOnMouseDownEdge(edgeId: string) {
		console.log('edge mouse down')
		if (selectedEdge() === edgeId) return setSelectedEdge(null)
		// Deselect the node if any was selected
		setSelectedNode(null)

		// Set the selected edge
		setSelectedEdge(edgeId)
	}

	function handleOnDeleteEdge(edgeId: string) {
		// Find the deleted edge
		const edgeToDelete = edges().find((edge) => edge.id === edgeId)

		if (edgeToDelete) {
			// Delete the edge  from start node
			const startNode = nodes().find(
				(node) => node.id === edgeToDelete.nodeStartId
			)

			// Update the start node
			if (startNode) {
				startNode.outputEdgeIds.set([
					...startNode.outputEdgeIds
						.get()
						.filter((edgeId) => edgeId !== edgeToDelete.id)
				])
			}

			// Delete the edge from end node
			const endNode = nodes().find((node) => node.id === edgeToDelete.nodeEndId)

            // Update the end node
            if (endNode) {
                endNode.inputEdgeIds.set([
                    ...endNode.inputEdgeIds
                        .get()
                        .filter((edgeId) => edgeId !== edgeToDelete.id)
                ])
            }

           // Delete the edge from the list of edges
           setEdges([...edges().filter((edge) => edge.id !== edgeToDelete.id)])

           // Deselect the edge
           setSelectedEdge(null)
		}
	}

	createEffect(() => {
		console.log(isInsideInput())
	})

	return (
		<div
			id='boardWrapper'
			class='h-screen w-screen select-none overflow-auto'
		>
			<FlowSettings
				onClickAdd={handleClickAdd}
				onClickDelete={handleClickDelete}
				showDelete={selectedNode() !== null}
			/>

			<div
				id='board'
				class={cn(
					{ '!cursor-grabbing': isGrabbingBoard() },
					'relative h-screen w-screen cursor-grab bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] transition-transform duration-300 ease-in-out [background-size:16px_16px]'
				)}
				onMouseDown={handleOnMouseDownBoard}
				onMouseUp={handleOnMouseUpBoard}
				onMouseMove={handleOnMouseMoveBoard}
			>
				<For each={edges()}>
					{(edge: Edge) => (
						<NodeEdge
							isSelected={selectedEdge() === edge.id}
							isInsideInput={isInsideInput() !== null}
							isNew={false}
							position={{
								x0: edge.currStartPosition.get().x,
								y0: edge.currStartPosition.get().y,
								x1: edge.currEndPosition.get().x,
								y1: edge.currEndPosition.get().y
							}}
							onMouseDownEdge={() =>
								handleOnMouseDownEdge(edge.id)
							}
							onClickDelete={() => handleOnDeleteEdge(edge.id)}
						/>
					)}
				</For>

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
							onMouseDownOutputHandler={handleOnMouseDownOutput}
							onMouseEnterInputHandler={handleOnMouseEnterInput}
							onMouseLeaveInputHandler={handleOnMouseLeaveInput}
							label={node.label}
						/>
					)}
				</For>

				{newEdge() !== null && (
					<NodeEdge
						isInsideInput={isInsideInput() !== null}
						isSelected={false}
						isNew={true}
						position={{
							x0: newEdge()!.currStartPosition.get().x,
							y0: newEdge()!.currStartPosition.get().y,
							x1: newEdge()!.currEndPosition.get().x,
							y1: newEdge()!.currEndPosition.get().y
						}}
						onMouseDownEdge={() => {}}
						onClickDelete={() => {}}
					/>
				)}
			</div>
		</div>
	)
}

export default Board
