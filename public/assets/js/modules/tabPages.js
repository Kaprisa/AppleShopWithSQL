import { $, $$ } from './bling'
import axios from 'axios'

export default (className, loadPage) => {
	$$(`.${className}-navigation__link`).on('click', function(e) {
		e.preventDefault()
		const page = this.getAttribute('href')
		axios.get(`${page}?axs=1`).then(res => {
			$(`.${className}-navigation__link_active`).classList.remove(`${className}-navigation__link_active`)
			this.classList.add(`${className}-navigation__link_active`)
			$(`.${className}__holder`).innerHTML = res.data
			const state = { page }
			history.pushState(state, 'AppleShop', state.page)
			loadPage()
		}).catch(err => {
			console.error(err)
		})
	})
}