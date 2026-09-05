import { component$ } from '@builder.io/qwik'
import { ContactForm } from './components/ContactForm'

export const App = component$(() => {
  return (
    <main class="page">
      <ContactForm />
      <footer class="attribution">
        Challenge by{' '}
        <a href="https://www.frontendmentor.io?ref=challenge" target="_blank" rel="noreferrer">
          Frontend Mentor
        </a>
        . Coded by{' '}
        <a href="https://www.frontendmentor.io/profile/1t1sCooL" target="_blank" rel="noreferrer">
          1t1sCooL
        </a>
        .
      </footer>
    </main>
  )
})
