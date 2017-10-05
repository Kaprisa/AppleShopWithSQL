function numValidator(input){
	input.on('keydown', function(e){
		const { keyCode } = e
		if (keyCode < 48 || keyCode > 57){
			if (keyCode !== 8 && keyCode !== 188 && keyCode !== 190) {
				e.preventDefault()
			}	
		}
	})
}

export { numValidator }