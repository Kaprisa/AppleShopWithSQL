import { $ } from '../modules/bling'

function tabs(tabsParentClass = 'tabs') {

	const tabsHolder = $(`.${tabsParentClass}`)
	let nav = tabsHolder.querySelectorAll(`.${tabsParentClass}-nav__item`)
	let tabs = tabsHolder.querySelectorAll(`.${tabsParentClass}__item`)

	nav.on('click', function() {
		const index = nav.indexOf(this)
		tabsHolder.querySelector(`.${tabsParentClass}-nav__item_active`).classList.remove(`${tabsParentClass}-nav__item_active`)
		tabsHolder.querySelector(`.${tabsParentClass}__item_active`).classList.remove(`${tabsParentClass}__item_active`)
		this.classList.add(`${tabsParentClass}-nav__item_active`)
		tabs[index].classList.add(`${tabsParentClass}__item_active`)
	})
	
}

export default tabs