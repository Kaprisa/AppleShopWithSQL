import { $, $$ } from './bling'
import popup, { dynamicPopup } from './popup'
import axios from 'axios'
import { numValidator } from './inputValidator'
import tabPages from './tabPages'
import typeAhead from './search'

tabPages('employee-manager', loadPage)

window.onload = function() {
  loadPage()
}

function loadPage() {
	const { href } = location
	const page = href.substring(href.lastIndexOf('/') + 1, href.length)
	switch (page) {
		case 'employeeEditor': {
			employeesEditor()
			break
		}
		case 'achivementsEditor': {
			achivementsEditor()
			break
		}
		case 'employeesList': {
			employeesList()
			break
		}
		default: 
			employeesEditor()
	}
}

const employeesEditor = () => {

	popup($('#show-achivements-popup'), $('.achivements-popup'))

	typeAhead($('.achivements-search'), 'achivements-search', '/employee/achivements/search', '/achivements', 'changeValue' )
	
	$$('.js-number').forEach(input => numValidator(input))

	$('.employee-editor').on('submit', function(e) {
		e.preventDefault()
		const data = {
			email: $('#email').value,
			name: $('#name').value,
			lastName: $('#lastName').value,
			position: $('#position').value,
			phone: $('#phone').value,
			salary: $('#salary').value,
			experience: $('#experience').value
		}
		axios.post(this.action, data).then(res => {
			dynamicPopup({ action: 'success', msg: 'Информация о сотруднике успешно сохранена' })
		}).catch(err => {
			dynamicPopup({ action: 'error', msg: 'Не удалось сохранить инфомацию о сотруднике' })
			console.error(err)
		})
	})

	$('#save-employee-achivement').on('click', function() {
		axios.post(this.getAttribute('data-action'), { name: $('.achivements-search__input').value }).then(res => {
			dynamicPopup({ action: 'success', msg: 'Достижение сотрудника успешно добавлено' })
		}).catch(err => {
			dynamicPopup({ action: 'error', msg: 'Не удалось добавить достижение' })
			console.error(err)
		})
	})
}

const employeesList = () => {

}

const achivementsEditor = () => {
	$('.achivements-editor').on('submit', function(e) {
		e.preventDefault()
		const data = {
			name: $('#name').value,
			description: $('#description').value,
			icon: $('#icon').value
		}
		axios.post(this.action, data).then(res => {
			dynamicPopup({ action: 'success', msg: 'Достижение успешно сохранено' })
			$('.achivements__list').remove()
			$('.admin-achivements__views').innerHTML += res.data
		}).catch(err => {
			dynamicPopup({ action: 'error', msg: 'Не удалось сохранить достижение' })
			console.error(err)
		})
	})
}
