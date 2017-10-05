import axios from 'axios'
import { hidePopup, showPopup, dynamicPopup } from './popup'
import { $, $$ } from '../modules/bling'

function order(popup, id) {
	dynamicPopup({ action: 'info', msg: 'Это действие пока недоступно, но мы работаем над этим. Товар у вас в корзине, пройдите в личный кабинет, чтобы купить его' })
}

function buyOneClick(){
	$$('.buy-one-click').on('click', function(e){
		e.preventDefault()
		const parent = this.parentElement
		const popup = $('.buy-popup')
		const img = parent.querySelector('.card__img').src
		const name = parent.querySelector('.card__title').innerHTML
		const price = parent.querySelector('.card__price').innerHTML
		const id = parent.getAttribute('data-id')
		popup.querySelector('.buy-popup__img').src = img
		popup.querySelector('.buy-popup__name').innerHTML = name
		popup.querySelector('.buy-popup__price').innerHTML = price
		showPopup(popup)
		popup.querySelector('#order').on('click', function() {
			//order(popup, id)
			hidePopup(popup)
			parent.querySelector('.add-to-card').click()
		})
	})
}

export default buyOneClick()