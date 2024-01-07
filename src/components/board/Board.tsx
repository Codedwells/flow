import { Component, createSignal } from 'solid-js'

const Board: Component = () => {
	const [isGrabbingBoard, setIsGrabbingBoard] = createSignal<boolean>(false)
	return (
		<div id='boardWrapper'>
			<div id='board'></div>
			<h1 class='text-2xl font-semibold'>Hello world</h1>
		</div>
	)
}

export default Board
