import type { Component } from 'solid-js'
import Board from './components/board/Board'

const App: Component = () => {
	return (
		<main class='max-w-screen min-h-screen font-sans flex items-center justify-center antialiased'>
        <Board/>
		</main>
	)
}

export default App
