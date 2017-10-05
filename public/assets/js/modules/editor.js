import { $, $$ } from './bling'
import { numValidator } from './inputValidator'
import axios from 'axios'
import autocomplete from './autocomplete'
import popup, { showPopup, hidePopup, dynamicPopup } from './popup'

function uploadPhoto(photo, cb){
	if (!photo) return cb('')
	const config = {
      headers: { 'content-type': 'multipart/form-data' }
  	}
	 	const formData = new FormData()
	  formData.append("photo", photo)
	  axios.post('/api/fileUpload', formData, config)
	    .then( res =>  {
	    	cb(res.data)
	    }).catch(err => {
	    	console.error(err) 
	    	return
	    })
}

function loadPhoto(input, img) {
	input.on('change', function(event){
		const file = event.target.files[0]
		const fileReader = new FileReader()
		fileReader.onload = (function(theFile) {
	   	return function(e) {
	      img.setAttribute('src', e.target.result)
	    }
	  })(file)
	  fileReader.readAsDataURL(file)
	})
}

function postData(data) {
 	uploadPhoto($('#photo').files[0], function(photo) {
		if (photo.length) data.photo = photo
		axios.post($('.editor__form').action, data).then(res => {
			dynamicPopup({action: 'success', msg: 'Данные успешно загружены!'})
		}).catch(err => {
			dynamicPopup({action: 'error', msg: 'Ошибка загрузки данных :('})
			console.error(err)})
	})
}

function editor(){

 if ($('.editor')) {

		$$('.js-number').forEach( input => numValidator(input))

		if($('#address')) {
			autocomplete($('#address'), $('#lat'), $('#lng'))
		}

		if ($('#js-show-models-editor')) {
			popup($('#js-show-models-editor'), $('.model__popup'))
		}

		if($('#photo')){
			loadPhoto($('#photo'), $('.editor__img'))
		}

		if ($('#js-save-model')) {
			$('#js-save-model').on('click', function(e) {
				e.preventDefault()
				const data = {
					modelName: $('#modelName').innerHTML,
					type: $('#type').innerHTML,
					os: $('#os').innerHTML,
					processor: $('#processor').innerHTML,
					workingTime: $('#workingTime').innerHTML,
					mainCamera: $('#mainCamera').innerHTML,
					frontCamera: $('#frontCamera').innerHTML,
					width: $('#width').innerHTML,
					height: $('#height').innerHTML,
					screenDiagonal: $('#screenDiagonal').innerHTML,
					weight: $('#weight').innerHTML
				}
				axios.post('/model/add', data).then(res => {
					hidePopup($('.model__popup'))
					$('#modelName').innerHTML = '',
					$('#type').innerHTML = '',
					$('#os').innerHTML = '',
					$('#workingTime').innerHTML = '',
					$('#mainCamera').innerHTML = '',
				  $('#frontCamera').innerHTML = '',
					$('#width').innerHTML = '',
					$('#height').innerHTML = '',
					$('#screenDiagonal').innerHTML = '',
					$('#weight').innerHTML = ''
					dynamicPopup({action: 'success', msg: 'Данные успешно загружены!'})
				}).catch(err => {
					dynamicPopup({action: 'error', msg: 'Ошибка загрузки данных :('})
					console.error(err)
				})
			})
		}

		if ($('#delete-model')) {
			$('#delete-model').on('click', function() {
				axios.delete(this.getAttribute('data-action')).then( res => {
					dynamicPopup({ action: 'success', msg: 'Удаление прошло успешно!' })
					hidePopup($('.model__popup'))
					$('#modelName').innerHTML = '',
					$('#type').innerHTML = '',
					$('#os').innerHTML = '',
					$('#workingTime').innerHTML = '',
					$('#mainCamera').innerHTML = '',
				  $('#frontCamera').innerHTML = '',
					$('#width').innerHTML = '',
					$('#height').innerHTML = '',
					$('#screenDiagonal').innerHTML = '',
					$('#weight').innerHTML = ''
					this.remove()
				}).catch(err => {
					dynamicPopup({ action: 'error', msg: 'Не удалось удалить данные :(' })
					console.error(err)
				})
			})
		}

		$('.editor__form').on('submit', function(e) {
		 	e.preventDefault()

		 	if ($('#product-editor')) {
			 	
			 	const data = {
			 		type: $('#productType').value,
			 		model: $('#model').value,
			 		description: $('#description').value,
			 		price: $('#price').value,
			 		count: $('#count').value,
			 		color: $('#color').innerHTML,
				 	memory: $('#memory').innerHTML
			 	}
			 	postData(data)
			}

			if ($('#store-editor')) {

				const data = {
			 		name: $('#name').value,
			 		phone: $('#phone').value,
			 		description: $('#description').value,
			 		businessHours: [],
			 		address: $('#address').value,
			 		lat: $('#lat').value,
			 		lng: $('#lng').value,
			 		businessWeekday: `${$('#weekdays-start').value} - ${$('#weekdays-end').value}`,
			 		businessWeekend: `${$('#weekend-start').value} - ${$('#weekend-end').value}`
			 	}
			 	postData(data)
			}
		})

		if ($('#confirm-delete')) {

			$('#confirm-delete').on('click', function(){
				const popup = $('.confirm-popup')
				showPopup(popup, false)
				popup.querySelector('#cancel').on('click', function(){
					hidePopup(popup)
				})
				popup.querySelector('.confirm-popup__form').on('submit', function(e) {
					e.preventDefault()
					const action = this.action
					axios.delete(action).then( res => {
						dynamicPopup({ action: 'success', msg: 'Удаление прошло успешно!' })
						hidePopup(popup)
						this.action = action.substring(0, action.lastIndexOf('/'))
					}).catch(err => {
						dynamicPopup({ action: 'error', msg: 'Не удалось удалить данные :(' })
						console.error(err)
					})
				})
			})
		}
	}
}


export default editor()