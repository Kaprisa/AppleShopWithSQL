import '../sass/pages/index.sass'
import typeAhead from './modules/search'
import callback from './modules/callback'
import slider from './modules/slider'
import { $, $$ } from './modules/bling'
import showPopup from './modules/popup'
import './modules/order'
import './modules/auth'
import './modules/addToCard'

showPopup($('.js-callback-popupShow'), $('.callback-popup'))
callback($('#callback'), $('.callback-popup'))
typeAhead($('.search'))

slider($('.slider'))
