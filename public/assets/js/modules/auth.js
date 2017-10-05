import axios from 'axios'
import { hidePopup, showPopup, dynamicPopup } from './popup'
import { $, $$ } from '../modules/bling'

function showError(err, action) {
	const message = document.createElement('div')
	message.className = 'user-auth-popup__error fade-in'
	message.innerHTML = (action === 'login') ? 'Неверное имя пользователя или пароль' : 'Ошибка регистрации'
	$('#username').parentNode.insertBefore(message, $('#username'))
	setTimeout(() => {
		message.classList.remove('fade-in')
		message.classList.add('slide_up')
		setTimeout(() => {
			message.remove()
		}, 2000)
	}, 5000)
	console.error(err)
}

function authServ(action, popup, data = {}, msg = 'Вы успешно авторизованы!'){
	axios.post(`/${action}`, data).then( res => {
		if (res.data.errors) {
			return errors.forEach(err => {
				showError(err, action)
			})
		}
		$('.user__holder').innerHTML = res.data
		hidePopup(popup)
		dynamicPopup({ action: 'success', msg })
	}).catch(err => {
		showError(err, action)
	})
}

function auth(action){
	if (!$$('.js-user-showPopup').length) return
	$$('.js-user-showPopup').on('click', function(e){
		e.preventDefault()
		const actionRu = this.innerHTML
		const action = (actionRu === 'Регистрация') ? 'register' : 'login'
		const popup = $('.user-auth-popup')
		popup.querySelector('.user-auth-popup__title').innerHTML = actionRu
		if (action === 'login') {
			popup.querySelector('#confirmPassword').style.display = 'none'
			popup.querySelector('#email').style.display = 'none'
		}
		popup.querySelector('.user-auth-popup__link').style.display = (action === 'register') ? 'none' : 'block'
		popup.querySelector('.user-auth-popup__btn').innerHTML = (action === 'register') ? 'Зарегистрироваться' : 'Войти'
		showPopup(popup)
		popup.querySelector('.form').on('submit', function(e){
			e.preventDefault()
			const data = {
				username: this.username.value,
				email: this.email.value,
				password: this.password.value
			}
			if (action == 'register'){
				data.confirmPassword = this.confirmPassword.value
			}
			authServ(action, popup, data)
		})
	})
	$('.user-auth-popup__link').on('click', function(e){
		e.preventDefault()
		$('.user-auth-popup__forgot-form').style.display = 'block'
		$('.user-auth-popup__forgot-form').classList.add('slide_down')
		setTimeout(() => {
			$('.user-auth-popup__forgot-form').classList.remove('slide_down')
		}, 2500)
	})
	$('#forgot-form').on('submit', function(e){
		e.preventDefault()
		axios.post(this.action, {email: this.email.value}).then( res => {
			const inner = this.innerHTML
			this.innerHTML = `<div class="user-auth-popup__res">На вашу электронную почту отправлеена инструкция восстановлния пароля</div>`
			setTimeout(function(){
				$('.user-auth-popup__forgot-form').style.display = 'none'
				this.innerHTML = inner
			}, 1500)
		})
	})
}

export default auth()