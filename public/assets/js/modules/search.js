import axios from 'axios'
import dompurify from 'dompurify'

function searchResultsHtml(results, searchClassName, href) {
	if (!results || !results.length) return
	return results.map( res => {
		return `<a href="${href}/${res.ID}" class="${searchClassName}__link">${res.Name}</a>`
	}).join('')
}

function typeAhead(search, searchClassName = 'search', action = '/api/search', href = '/product', afterEnter = 'changePage' ) {
	if (!search) return
	const searchInput = search.querySelector(`.${searchClassName}__input`)
	const searchResults = search.querySelector(`.${searchClassName}__results`)
	searchInput.on('input', function() {
		if (!this.value){
			searchResults.style.display = 'none'
			return
		}
		searchResults.style.display = 'block'
		axios.get(`${action}?q=${this.value}`).then( res => {
			if (res.data.length && Array.isArray(res.data)) {
				searchResults.innerHTML = dompurify.sanitize(searchResultsHtml(res.data, searchClassName, href))
			} else {
				searchResults.innerHTML = dompurify.sanitize(`<span class="${searchClassName}__link">Ничего не найдено:(</a>`)
			}
		}).catch( err => {console.error(err)})
	})
	searchInput.on('keyup', function(e) {
		const { keyCode } = e
		if (![38,40,13].includes(keyCode)) return
		const activeClass = `${searchClassName}__link_active`
		const current = search.querySelector(`.${searchClassName}__link_active`)
		const items = search.querySelectorAll(`.${searchClassName}__link`)
		let next
		if ( keyCode === 38 && current ) {
			next = current.previousElementSibling || items[ items.length - 1 ]
		} else if ( keyCode === 38 ) {
			next = items[ items.length - 1 ]
		} else if ( keyCode === 40 && current ) {
			next = current.nextElementSibling || items[0]
		} else if ( keyCode === 40 ) {
			next = items[0]
		} else if ( keyCode === 13 && current ) {
			if (afterEnter === 'changePage') {
				window.location.href = current.href
			} else if (afterEnter === 'changeValue') {
				searchInput.value = current.innerHTML
				searchResults.innerHTML = ''
				searchInput.blur()
			}
			return
		}
		if (current) {
			current.classList.remove(`${searchClassName}__link_active`)
		}
		next.classList.add(`${searchClassName}__link_active`)
	})
}


export default typeAhead