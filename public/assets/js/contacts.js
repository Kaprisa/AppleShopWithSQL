import '../sass/pages/contacts.sass'
import typeAhead from './modules/search'
import './modules/auth'
import { $ } from './modules/bling'
import callback from './modules/callback'
import showPopup from './modules/popup'
import './modules/auth'
import makeMap from './modules/map'

showPopup($('.js-callback-popupShow'), $('.callback-popup'))
callback($('#callback'), $('.callback-popup'))
typeAhead($('.search'))
makeMap($('#map'))