import axios from 'axios'
import { hidePopup } from './popup'

function callback(elem, popup){
	elem.on('click', function(e){
		e.preventDefault()
		const phone = popup.querySelector('#callback-phone').value
		axios.post('/callback', {phone: phone}).then(res=> {
			popup.querySelector('.popup__content').innerHTML = '<div class="callback-popup__res">Спасибо за заявку!</div>'
			setTimeout(function(){
				hidePopup(popup)
			}, 1500)
		})
	})
}

export default callback