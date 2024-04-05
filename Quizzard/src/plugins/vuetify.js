/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables
import { createVuetify } from 'vuetify'

const customTheme = {
  dark: true,
  colors: {
    primary: '#2C2929',
    secondary: '#3E3E3E',
    third: '#393939',
    button: '#07B5FF',
    buttonSecond: '#41455D',
    buttonThird: `#933`,
    backgroundMain: '#4D4D4D',
    background: '#3e3e3ed5', // If not using lighten/darken, use base to return hex
  }
}

  
// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    defaultTheme: 'customTheme',
    themes: {
      customTheme,
    },
  },
})
