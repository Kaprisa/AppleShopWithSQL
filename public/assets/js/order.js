import '../sass/pages/order.sass'
import callback from './modules/callback'
import typeAhead from './modules/search'
import { $$, $ } from './modules/bling'
import counter from './modules/counter'
import { numValidator } from './modules/inputValidator'
import axios from 'axios'
import callback from './modules/callback'
import typeAhead from './modules/search'
import { dynamicPopup } from './modules/popup'

if ($('.order-inner')) {

	window.onload = function() {
  	loadPage()
	}

	$$('.btn_prev, .btn_next, .steps__link').on('click', function(e) {
		e.preventDefault()
		const page = this.getAttribute('href')
		axios.get(`${page}?axs=1`).then(res => {
			$('.steps__item_active').classList.remove('steps__item_active')
			$(`.steps__link[href="/order/steps/${page[page.length - 1]}"]`).parentElement.classList.add('steps__item_active')
			$('.order-inner').innerHTML = res.data
			const state = { page }
			history.pushState(state, 'AppleShop', state.page)
			loadPage()
		}).catch(err => {
			console.error(err)
		})
	})

}

function loadPage() {
	const href = location.href
	const step = Number(href[href.length - 1])
	const btnNext = $('.btn_next')
	const btnPrev = $('.btn_prev')
	if (step === 4) {
		btnNext.style.visibility = 'hidden'
	} else {
		btnNext.setAttribute('href', `${href.substring(0, href.lastIndexOf('/'))}/${step + 1}`)
		btnNext.style.visibility = 'visible'
	}
	if (step === 1) {
		btnPrev.style.visibility = 'hidden'
	} else {
		btnPrev.setAttribute('href', `${href.substring(0, href.lastIndexOf('/'))}/${step - 1}`)
		btnPrev.style.visibility = 'visible'
	}
	switch (step) {
		case 1: {
			step1()
			break
		}	
		case 2: {
			step2()
			break
		}
		case 3: {
			step3()
			break
		}
		case 4: {
			step4()
			break
		}
	}
}

const step1 = () => {
	$$('.cart-product').forEach( item => {
		counter( item.querySelector('.counter'),Number(item.querySelector('.js-cart-product-price').innerHTML), item.querySelector('.js-cart-product-total'))
		item.querySelector('#count').addEventListener('change', function(){
			let sum = 0
			$$('.js-cart-product-total').forEach( el => {
				sum += Number(el.innerHTML)
			})
			$('.js-shopping-cart-total').innerHTML = sum
		})
	})

	$$('.js-number').forEach( input => numValidator(input))

		if ($('.js-deleteFromBasket')) {
		$$('.js-deleteFromBasket').on('click', function() {
			const product = this.parentNode.parentNode
			const price = product.querySelector('.js-cart-product-total').innerHTML
			const id = product.getAttribute('data-id')
			axios.delete(`/api/product/${id}/delete`).then( res => {
				product.classList.add('slide_up')
				setTimeout(() => {
					product.remove()
					if ($('.js-shopping-cart-total')){
						const total = $('.js-shopping-cart-total').innerHTML
						$('.js-shopping-cart-total').innerHTML = total - price
					}
					if (!$('.shopping-cart__item')) {
						$('.shopping-cart').innerHTML = 
							`<div class="grid-row grid-row_center">
								<p class="title">Ваша корзина пуста :(</p>
							</div>`
					}
				}, 2000)
				$('.user-goods__text').innerHTML = res.data
			}).catch( err => { console.error(err) } )
		})
	}
}

const step2 = () => {
	$('#order-data').on('submit', function(e) {
		e.preventDefault()
		localStorage.setItem('phone', $('#phone').value)
		localStorage.setItem('address', $('#address').value)
	})
}

const step3 = () => {
	const name = localStorage.getItem('delivery')
	if (name && name === 'true') {
		$('.input_radio[name="deliveryGet"]').checked = true
	} else {
		$('.input_radio[name="storeGet"]').checked = true
	}
	$$('.label_radio').on('click', function() {
		$('.input_radio:checked').checked = false
		this.querySelector('.input_radio').checked = true
		localStorage.setItem('delivery', $('.input_radio[name="deliveryGet"]').checked)
	})
}

const step4 = () => {
	$('.pay-for-orders').on('click', function() {
		const data = {
			address: localStorage.getItem('address'),
			phone: localStorage.getItem('phone'),
			delivery: localStorage.getItem('delivery')
		}
		axios.post('/order', data).then(res => {
			const { action, msg } = res.data
			dynamicPopup({ action, msg })
			if (action === 'success') {
				$('.user-goods__text').innerHTML = 'Товаров 0 (0 руб.)'
				$('.order').innerHTML = '<div class="order__empty">Ваша корзина пуста</div>'
			}
		}).catch(err => {
			dynamicPopup({ action: 'error', msg: 'Не удалось сохранить ваш заказ :(' })
		})
	})
}
