import type { Component } from 'solid-js'
import Board from './components/board/Board'

const App: Component = () => {
	return (
		<main class='max-w-screen flex min-h-screen items-center justify-center font-sans antialiased'>
			<Board />
		</main>
	)
}

export default App
