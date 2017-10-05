import axios from 'axios'
import { hidePopup, dynamicPopup } from './popup'
import { $ } from './bling'

const productID = $('.product').getAttribute('data-id')

function review(){

	const popup = $('.review-popup')

	popup.querySelectorAll('.star').on('click', function() {
		const active = popup.querySelector('.star_active')
		if (active) {
			active.classList.remove('star_active')
		}
		this.classList.add('star_active')
	})

	$('#review-form').on('submit', function(e) {
		e.preventDefault()
		const data = {
			text: popup.querySelector('.textarea').value,
			rating: popup.querySelector('.star_active') ? popup.querySelector('.star_active').getAttribute('data-star') : 0
		}
		axios.post(this.action, data).then(res=> {
			this.reset()
			dynamicPopup({ action: 'success', msg: 'Спасибо за отзыв!' })
			hidePopup(popup)
		}).catch(err => {
			dynamicPopup({ action: 'error', msg: 'Не удалось сохранить ваш отзыв :(' })
		})
	})
	if ($('#btn-more')) {
		$('.product-about__reviews').querySelector('#btn-more').on('click', function() {
			axios.get(`/reviews/more?id=${productID}`).then(res => {
				$('.reviews__holder').innerHTML += res.data
			}).catch((err) => console.error(err))
		})
	}
}

export default review()