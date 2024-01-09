import type { Component } from 'solid-js'
import Board from './components/board/Board'

const App: Component = () => {
	return (
		<main class='max-w-screen flex min-h-screen items-center justify-center font-sans antialiased'>
			<MobileApp />
			<Board />
		</main>
	)
}

export default App

const MobileApp: Component = () => {
	return (
		<div class='min-w-screen max-w-screen flex max-h-screen min-h-screen items-center justify-center overflow-hidden lg:hidden'>
			<p class='text-xl text-center font-bold'>Open on a desktop for optimal performance!</p>
		</div>
	)
}
