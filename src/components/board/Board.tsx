import { Component, createSignal, onMount } from 'solid-js'
import { cn } from '../../lib/utils'

const Board: Component = () => {
	const [isGrabbingBoard, setIsGrabbingBoard] = createSignal<boolean>(false)
	const [scale, setScale] = createSignal<number>(1)
	const [clickPosition, setClickPosition] = createSignal<{
		x: number
		y: number
	}>({ x: -1, y: -1 })

	function handleONMouseDown(event: any) {
		// Set grabbing to true
		setIsGrabbingBoard(true)

		setClickPosition({ x: event.x, y: event.y })
	}

	function handleOnMouseUp() {
		// Set grabbing to false
		setIsGrabbingBoard(false)

		// Reset the click position
		setClickPosition({ x: -1, y: -1 })
	}

	function handleOnMouseMove(event: any) {
		// If user clicked on the board
		if (clickPosition().x >= 0 && clickPosition().y >= 0) {
			const deltaX = event.x - clickPosition().x
			const deltaY = event.y - clickPosition().y

			const boardWrapper = document.getElementById('boardWrapper')

			if (boardWrapper) {
				boardWrapper.scrollBy(-deltaX, -deltaY)

				// Update the click position
				setClickPosition({ x: event.x, y: event.y })
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

					// Restrict the scale to a max of 2 and a min of 1
					setScale(Math.min(Math.max(1, scale()), 2))

					// Apply the scale to the board
					board.style.transform = `scale(${scale()})`
					board.style.marginTop = `${(scale() - 1) * 50}vh`
					board.style.marginLeft = `${(scale() - 1) * 50}vw`
				},
				{ passive: false }
			)
		}
	})
	return (
		<div id='boardWrapper' class='h-screen w-screen overflow-auto'>
			<div
				id='board'
				class={cn(
					{ '!cursor-grabbing': isGrabbingBoard() },
					'relative h-screen w-screen cursor-grab bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] transition-transform duration-500 ease-in-out [background-size:16px_16px]'
				)}
				onMouseDown={handleONMouseDown}
				onMouseUp={handleOnMouseUp}
				onMouseMove={handleOnMouseMove}
			>
			</div>
		</div>
	)
}

export default Board
