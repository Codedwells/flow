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
		<div class='min-w-screen max-w-screen flex max-h-screen min-h-screen flex-col items-center justify-center overflow-hidden antialiased lg:hidden'>
			<a href='/'>
				<img src='/assets/logo.svg' class='w-[12rem]' />
			</a>
			<p class='my-4 text-center text-2xl text-sky-950 font-bold'>
				Open on a desktop for optimal performance!
			</p>
		</div>
	)
}
