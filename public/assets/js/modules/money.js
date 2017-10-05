import axios from 'axios'
import { $ } from './bling'
import { dynamicPopup, hidePopup } from './popup'

function addMoney() {
	if (!($('#add-money'))) return
	$('#add-money').on('click', function(e) {
		e.preventDefault()
		const data = {
			money: $('#deposit').value
		}
		axios.post('/api/deposit', data).then(res => {
			$('#deposit').value = ''
			hidePopup($('.money-popup'))
			document.querySelectorAll('.money').forEach(item => {
				item.innerHTML = res.data.balance
			})
			dynamicPopup({ action: 'success', msg: 'Ваш счёт успешно пополнен!' })
		}).catch(err => {
			dynamicPopup({ action: 'error', msg: 'Не удалось пополнить ваш счёт:(' })
			console.error(err)
		})
	})
}

export default addMoney()