import type { Component } from 'solid-js'
import Board from './components/board/Board'

const App: Component = () => {
	return (
		<main class='max-w-screen min-h-screen bg-slate-50 font-sans antialiased'>
			<Board />
		</main>
	)
}

export default App
