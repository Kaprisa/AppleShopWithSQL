import axios from 'axios'
import { $$, $ } from '../modules/bling'
import { dynamicPopup, showPopup } from '../modules/popup'

function addToCard(){
	$$('.add-to-card').on('click', function(){
		const id = this.parentElement.getAttribute('data-id')		
		axios.post(`/api/product/${id}/addToCart`, { count: ( $('#count') ? $('#count').value : 1 ) }).then(res => {
			if (res.data.action && res.data.action === 'error') {
				dynamicPopup({ action: 'error', msg: res.data.msg })
				showPopup($('.user-auth-popup'))
				return
			}
			$('.user-goods__text').innerHTML = res.data
			dynamicPopup({ action: 'success', msg: 'Товар успешно добавлен в вашу корзину!'})
			/*const textPrice = this.parentElement.querySelector('.card__price').innerHTML
			const price = parseInt(textPrice.slice(0 , textPrice.indexOf(' ')))
			const countHolder = $('#goods-count')
			const totalHolder = $('#goods-total')
			const count = parseInt(countHolder.innerHTML)
			const total = parseInt(totalHolder.innerHTML)
			countHolder.innerHTML = count + 1
			totalHolder.innerHTML = total + price*/
		}).catch(err => {
			console.error(err)
			dynamicPopup({ action: 'error', msg: 'Ошибка добавления товара :(' })
		})
	})
}

export default addToCard()