function equalHeight(items){
	let height = 0
	items.forEach(item => {if (item.clientHeight > height) {height = item.clientHeight}})
	items.forEach(item => {item.style.height = height + 'px'})
}

export default equalHeight