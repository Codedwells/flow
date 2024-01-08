import { Component, createSignal, onCleanup } from 'solid-js'
import { cn } from '../lib/utils'
import { FiTrash, FiPlus } from 'solid-icons/fi'

type ButtonsComponentProps = {
	showDelete: boolean
	onClickAdd: (
		numberInputs: number,
		numberOuputs: number,
		label: string
	) => void
	onClickDelete: () => void
}

function handleClickOutside(el: any, accesor: any) {
	const onClick = (e: any) => !el.contains(e.target) && accesor()
	document.body.addEventListener('click', onClick)

	onCleanup(() => document.body.removeEventListener('click', onClick))
}

const FlowSettings: Component<ButtonsComponentProps> = (
	props: ButtonsComponentProps
) => {
	const [isOpen, setIsOpen] = createSignal<boolean>(false)
	const [numberInputs, setNumberInputs] = createSignal<number>(0)
	const [numberOutputs, setNumberOutputs] = createSignal<number>(0)

	function handleAddNode() {
		if (
			numberInputs() > 4 ||
			numberOutputs() > 4 ||
			numberInputs() < 0 ||
			numberOutputs() < 0
		)
			return

		setIsOpen(false)

		// Tell the parent component to add a node
		props.onClickAdd(numberInputs(), numberOutputs(), 'Test Node')

		// Reset the number of inputs and outputs
		setNumberInputs(0)
		setNumberOutputs(0)
	}

	return (
		<section
			class={cn(
				{ 'gap-5': isOpen() },
				'absolute right-0 z-30 mr-2 mt-2 flex h-fit rounded-lg border bg-white p-4 shadow-lg'
			)}
		>
			<div>
				<p class='mb-3 border-b-2 pb-2 text-center text-3xl font-bold'>
					Flow
				</p>

				<div
					class={cn(
						{ '!justify-center': !props.showDelete },
						{ 'h-[9rem] flex-col !justify-end': isOpen() },
						'flex w-full items-center justify-between gap-4'
					)}
				>
					<button
						onClick={props.onClickDelete}
						class={cn(
							{
								'!hidden': !props.showDelete
							},
							'group/btn ring-offset-background focus-visible:ring-ring inline-flex h-10 w-10 items-center justify-center whitespace-nowrap rounded-full bg-red-900 px-4 py-2 text-sm font-bold text-slate-200 transition-all duration-500 ease-in-out hover:w-[6rem] hover:space-x-2 hover:rounded-2xl hover:bg-red-900/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50'
						)}
					>
						<span class='sr-only'>Delete</span>
						<FiTrash class='h-5 w-5 group-hover/btn:mr-2 group-hover/btn:h-4 group-hover/btn:w-4' />
						<span class='hidden group-hover/btn:inline-block'>
							{' '}
							Delete
						</span>
					</button>

					<button
						onClick={() => setIsOpen((prev) => !prev)}
						class='group/add ring-offset-background focus-visible:ring-ring inline-flex h-10 w-10 items-center justify-center whitespace-nowrap rounded-full border-2 border-emerald-200 bg-emerald-200 px-4 py-2 text-sm font-bold text-emerald-800 transition-all duration-500 ease-in-out hover:w-[6rem] hover:space-x-2 hover:rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:border-emerald-800 active:opacity-50 disabled:pointer-events-none disabled:opacity-50'
					>
						<span class='sr-only'>Add</span>
						<FiPlus class='h-6 w-6 group-hover/btn:mr-2 group-hover/btn:h-4 group-hover/btn:w-4' />{' '}
						<span class='hidden group-hover/add:inline-block'>
							Add
						</span>
					</button>
				</div>
			</div>

			<div
				class={cn(
					{ '!inline-block !h-[13rem] !w-[10rem]': isOpen() },
					'h-0 w-0 transition-all duration-300'
				)}
				ref={(el) => handleClickOutside(el, () => setIsOpen(false))}
			>
				<div
					class={cn(
						{ '!hidden': !isOpen() },
						'mt-3 flex flex-col gap-2'
					)}
				>
					<label
						for='numberInputs'
						class='text-sm font-bold text-slate-800'
					>
						Number of inputs
					</label>
					<input
						type='number'
						value={numberInputs()}
						onInput={(e: any) =>
							setNumberInputs(Number(e.target.value.trim()))
						}
						min={0}
						max={4}
						class='focus-visible:ring-ring h-10 w-full rounded-md border border-slate-200 px-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2'
					/>
				</div>
				<div
					class={cn(
						{ '!hidden': !isOpen() },
						'mt-2 flex flex-col gap-2'
					)}
				>
					<label
						for='numberOutputs'
						class='text-sm font-bold text-slate-800'
					>
						Number of outputs
					</label>
					<input
						type='number'
						value={numberOutputs()}
						onInput={(e: any) =>
							setNumberOutputs(Number(e.target.value.trim()))
						}
						min={0}
						max={4}
						class='focus-visible:ring-ring h-10 w-full rounded-md border border-slate-200 px-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2'
					/>
				</div>

				<button
					onClick={handleAddNode}
					class={cn(
						{ '!hidden': !isOpen() },
						'group/node ring-offset-background focus-visible:ring-ring mt-2 inline-flex h-10 w-full items-center justify-center whitespace-nowrap rounded-xl border-2 border-emerald-500 px-4 py-2 text-sm font-bold text-emerald-500 transition-all duration-500 ease-in-out hover:border-emerald-200 hover:bg-emerald-200 hover:text-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:border-emerald-500 active:bg-transparent active:opacity-50 disabled:pointer-events-none disabled:opacity-50'
					)}
				>
					<span class='sr-only'>Add Node</span>
					<span>Add Node</span>
				</button>
			</div>
		</section>
	)
}

export default FlowSettings
