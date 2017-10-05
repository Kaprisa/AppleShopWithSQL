import { $, $$ } from '../modules/bling'

function dropdown(dropdown) {
	const items = dropdown.querySelectorAll('.dropdown__item')
	const text = dropdown.previousElementSibling
	items.on('click', function() {
		let active = dropdown.querySelector('.dropdown__item_active')
		if (active != this && active) {
			active.classList.remove('dropdown__item_active')
		}	
		this.classList.add('dropdown__item_active')
		text.innerHTML = this.innerHTML
	})
}

export default dropdown