import axios from 'axios'
import { $ } from './bling'
import { dynamicPopup, showPopup } from './popup'

function like(){
	$('#like').on('click', function(){
		const id = $('.product').getAttribute('data-id')
		axios.post(`/api/products/${id}/like`).then(res=> {
			if (res.data.action && res.data.action === 'error') {
				dynamicPopup({ action: 'error', msg: res.data.msg })
				showPopup($('.user-auth-popup'))
				return
			}
			this.classList.toggle('btn-like_hearted')
		}).catch(console.error)
	})
}

export default like()