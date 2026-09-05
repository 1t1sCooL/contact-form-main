import { component$, useStore, useSignal, useVisibleTask$ } from '@builder.io/qwik'
import { SuccessToast } from './SuccessToast'

type QueryType = 'general' | 'support' | ''

interface FormValues {
  firstName: string
  lastName: string
  email: string
  queryType: QueryType
  message: string
  consent: boolean
}

type FormErrors = Record<keyof FormValues, string>

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Pure, module-level validator — safely serializable across Qwik QRL boundaries. */
function computeErrors(v: FormValues): FormErrors {
  return {
    firstName: v.firstName.trim() ? '' : 'This field is required',
    lastName: v.lastName.trim() ? '' : 'This field is required',
    email: !v.email.trim()
      ? 'This field is required'
      : EMAIL_RE.test(v.email.trim())
        ? ''
        : 'Please enter a valid email address',
    queryType: v.queryType ? '' : 'Please select a query type',
    message: v.message.trim() ? '' : 'This field is required',
    consent: v.consent ? '' : 'To submit this form, please consent to being contacted',
  }
}

export const ContactForm = component$(() => {
  const values = useStore<FormValues>({
    firstName: '',
    lastName: '',
    email: '',
    queryType: '',
    message: '',
    consent: false,
  })
  const errors = useStore<FormErrors>({
    firstName: '',
    lastName: '',
    email: '',
    queryType: '',
    message: '',
    consent: '',
  })
  const submitted = useSignal(false)
  const sent = useSignal(false)
  const formRef = useSignal<HTMLFormElement>()

  // In Qwik's CSR mode ($-event handlers don't attach), so wire the form up with a
  // single eager, delegated listener. Store mutations still drive fine-grained
  // re-renders (value/checked/class bindings), so the UI stays fully reactive.
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    const form = formRef.value
    if (!form) return

    const revalidate = () => {
      if (submitted.value) Object.assign(errors, computeErrors(values))
    }

    const onInput = (e: Event) => {
      const t = e.target as HTMLInputElement
      switch (t.id) {
        case 'firstName':
          values.firstName = t.value
          break
        case 'lastName':
          values.lastName = t.value
          break
        case 'email':
          values.email = t.value
          break
        case 'message':
          values.message = t.value
          break
        default:
          return
      }
      revalidate()
    }

    const onChange = (e: Event) => {
      const t = e.target as HTMLInputElement
      if (t.name === 'queryType') values.queryType = t.value as QueryType
      else if (t.type === 'checkbox') values.consent = t.checked
      else return
      revalidate()
    }

    const onSubmit = (e: Event) => {
      e.preventDefault()
      const next = computeErrors(values)
      Object.assign(errors, next)
      submitted.value = true
      if (Object.values(next).every((msg) => !msg)) sent.value = true
    }

    form.addEventListener('input', onInput)
    form.addEventListener('change', onChange)
    form.addEventListener('submit', onSubmit)
    return () => {
      form.removeEventListener('input', onInput)
      form.removeEventListener('change', onChange)
      form.removeEventListener('submit', onSubmit)
    }
  })

  return (
    <>
      {sent.value && <SuccessToast />}

      <form class="card" ref={formRef} noValidate>
        <h1 class="card__title">Contact Us</h1>

        <div class="row">
          <div class="field">
            <label class="field__label" for="firstName">
              First Name <span class="field__req" aria-hidden="true">*</span>
            </label>
            <input
              id="firstName"
              type="text"
              class={{ input: true, 'input--error': !!errors.firstName }}
              aria-invalid={!!errors.firstName}
              aria-describedby={errors.firstName ? 'firstName-error' : undefined}
              value={values.firstName}
            />
            {errors.firstName && (
              <p class="field__error" id="firstName-error">
                {errors.firstName}
              </p>
            )}
          </div>

          <div class="field">
            <label class="field__label" for="lastName">
              Last Name <span class="field__req" aria-hidden="true">*</span>
            </label>
            <input
              id="lastName"
              type="text"
              class={{ input: true, 'input--error': !!errors.lastName }}
              aria-invalid={!!errors.lastName}
              aria-describedby={errors.lastName ? 'lastName-error' : undefined}
              value={values.lastName}
            />
            {errors.lastName && (
              <p class="field__error" id="lastName-error">
                {errors.lastName}
              </p>
            )}
          </div>
        </div>

        <div class="field">
          <label class="field__label" for="email">
            Email Address <span class="field__req" aria-hidden="true">*</span>
          </label>
          <input
            id="email"
            type="email"
            class={{ input: true, 'input--error': !!errors.email }}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
            value={values.email}
          />
          {errors.email && (
            <p class="field__error" id="email-error">
              {errors.email}
            </p>
          )}
        </div>

        <fieldset class="field field--fieldset">
          <legend class="field__label">
            Query Type <span class="field__req" aria-hidden="true">*</span>
          </legend>
          <div class="row">
            {(
              [
                { value: 'general', label: 'General Enquiry' },
                { value: 'support', label: 'Support Request' },
              ] as const
            ).map((opt) => (
              <label
                key={opt.value}
                class={{ radio: true, 'radio--selected': values.queryType === opt.value }}
              >
                <input
                  type="radio"
                  name="queryType"
                  class="radio__input"
                  value={opt.value}
                  checked={values.queryType === opt.value}
                />
                <span class="radio__mark" aria-hidden="true" />
                <span class="radio__text">{opt.label}</span>
              </label>
            ))}
          </div>
          {errors.queryType && (
            <p class="field__error" id="queryType-error">
              {errors.queryType}
            </p>
          )}
        </fieldset>

        <div class="field">
          <label class="field__label" for="message">
            Message <span class="field__req" aria-hidden="true">*</span>
          </label>
          <textarea
            id="message"
            class={{ input: true, textarea: true, 'input--error': !!errors.message }}
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? 'message-error' : undefined}
            value={values.message}
          />
          {errors.message && (
            <p class="field__error" id="message-error">
              {errors.message}
            </p>
          )}
        </div>

        <div class="field field--consent">
          <label class="consent">
            <input type="checkbox" class="consent__input" checked={values.consent} />
            <span class="consent__mark" aria-hidden="true" />
            <span class="consent__text">
              I consent to being contacted by the team <span class="field__req" aria-hidden="true">*</span>
            </span>
          </label>
          {errors.consent && (
            <p class="field__error field__error--consent" id="consent-error">
              {errors.consent}
            </p>
          )}
        </div>

        <button type="submit" class="submit">
          Submit
        </button>
      </form>
    </>
  )
})
