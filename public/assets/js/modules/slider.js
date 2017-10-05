let left = 0
const count = 6

function move(elem) {
	elem.style.left = `-${left}%`
	if (left == (count - 1) * 100) {
		left = 0
	}
	setTimeout(() => { 
		left += 100
	  move(elem) 
	}, 5000)
}

function slider(elem) {
	const inner = elem.querySelector('.slider__inner')
	setInterval(move(inner), 2000)
}

export default slider