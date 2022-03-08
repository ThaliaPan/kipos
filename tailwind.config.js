module.exports = {
  content: ["./*.{html,js}", "./resources/js/app.js", './node_modules/tw-elements/dist/js/**/*.js'],
  theme: {
    extend: {},
  },
  plugins: [
    require('tw-elements/dist/plugin')
  ],
}
