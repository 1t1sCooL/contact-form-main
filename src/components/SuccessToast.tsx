import { component$ } from '@builder.io/qwik'

export const SuccessToast = component$(() => {
  return (
    <div class="toast" role="alert" aria-live="polite">
      <p class="toast__title">
        <img
          class="toast__icon"
          src="/assets/images/icon-success-check.svg"
          alt=""
          width="20"
          height="21"
        />
        Message Sent!
      </p>
      <p class="toast__text">Thanks for completing the form. We'll be in touch soon!</p>
    </div>
  )
})
