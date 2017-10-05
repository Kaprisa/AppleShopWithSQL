import '../sass/pages/catalog.sass'
import typeAhead from './modules/search'
import callback from './modules/callback'
import  dropdown from './modules/dropdown'
import popup from './modules/popup'
import { showPopup } from './modules/popup'
import './modules/order'
import { $, $$ } from './modules/bling'
import './modules/auth'
import './modules/addToCard'
import { changePage, sort } from './modules/changePage'

changePage('pagination')
changePage('goods-menu')
sort()

$$('.goods-menu__item').on('click', function() {
	if ($('.goods-menu__item_active')) {
		$('.goods-menu__item_active').classList.remove('goods-menu__item_active')
	}
	this.classList.add('goods-menu__item_active')
})

popup($('.js-callback-popupShow'), $('.callback-popup'))
callback($('#callback'), $('.callback-popup'))
typeAhead($('.search'))

$$('.js-dropdown').forEach(item => {
	dropdown(item)
})
