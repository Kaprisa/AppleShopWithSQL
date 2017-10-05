function changeValue(input, value) {
	if (value < 1) return
	input.value = value
}

function changeTotal( value, input, el) {
	if (el) {
		el.innerHTML = value
		let event = new Event("change")
		input.dispatchEvent(event)
	}
}

function counter(counter , num = 0, el = null) {
	const inc = counter.querySelector('#inc')
	const dec = counter.querySelector('#dec')
	let input = counter.querySelector('#count')
	inc.addEventListener('click', function(){
		changeValue(input, parseInt(input.value) + 1)		
		changeTotal(Number(el.innerHTML) + num, input, el)
	})
	dec.addEventListener('click', function() {
		changeValue(input, parseInt(input.value) - 1)
		changeTotal(Number(el.innerHTML) - num, input, el)
	})
	input.addEventListener('keydown', function(e) {
		if (e.keyCode === 48 && !input.value) {
			e.preventDefault()
		}
	})
	input.addEventListener('keyup', function(e) {
		if (!this.value) return
		changeTotal(num * input.value, input, el)
	})
}

export default counter