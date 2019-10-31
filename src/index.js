import './style.css'

import Prism from 'prismjs'

import 'prismjs/themes/prism-coy.css'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-javascript'

import 'prismjs/plugins/line-numbers/prism-line-numbers'
import 'prismjs/plugins/line-numbers/prism-line-numbers.css'

import './prism.css'

Prism.highlightAll();

window.displayMailChimpStatus = function (data) {
  if (!data.result || !data.msg) return

  const mcStatus = document.querySelector('.mc-status')

  if (!mcStatus) return

  mcStatus.innerHTML = data.msg

  mcStatus.focus()

  mcStatus.classList.remove('hidden')

  if (data.result === 'error') {
    mcStatus.classList.remove('mc-success')
    mcStatus.classList.add('mc-error')
    return;
  }

  mcStatus.classList.remove('mc-error')
  mcStatus.classList.add('mc-success')
}

const serialize = function (form) {
  let serialized = ''

  for (let i = 0; i < form.elements.length; i++) {

    const field = form.elements[i]

    if (!field.name || field.disabled || field.type === 'file' || field.type === 'reset' || field.type === 'submit' || field.type === 'button') continue

    if ((field.type !== 'checkbox' && field.type !== 'radio') || field.checked) {
      serialized += '&' + encodeURIComponent(field.name) + "=" + encodeURIComponent(field.value)
    }
  }

  return serialized;
}

const submitMailChimpForm = function (form) {
  let url = form.getAttribute('action')
  url = url.replace('/post?u=', '/post-json?u=')
  url += serialize(form) + '&c=displayMailChimpStatus'

  const script = window.document.createElement('script')
  script.src = url

  const ref = window.document.getElementsByTagName('script')[0]
  ref.parentNode.insertBefore(script, ref)

  script.onload = function () {
    this.remove()
  }
}

document.addEventListener('submit', function (event) {
  if (!event.target.classList.contains('validate')) return

  event.preventDefault()

  submitMailChimpForm(event.target)

}, false)

window.toggleMenu = function () {
  const menu = document.querySelector('.menu')
  const menuOpen = document.querySelector('.menu-open')
  const menuClose = document.querySelector('.menu-close')

  if (!menu || !menuOpen || !menuClose) return

  const isOpen = !menu.classList.contains('hidden')

  if (isOpen) {
    menu.classList.add('hidden')
    menuOpen.classList.remove('hidden')
    menuClose.classList.add('hidden')
  } else {
    menu.classList.remove('hidden')
    menuOpen.classList.add('hidden')
    menuClose.classList.remove('hidden')
  }
}