import { BackButton } from '~/components/BackButton'
import { CenterContent } from '~/components/CenterContent'
import { TextField, TextFieldInput, TextFieldLabel } from './TextField'
import { Svg } from '~/components/Svg'

export default function CheckoutPage() {
  return (
    <div className="mb-32 lg:mb-40">
      <CenterContent>
        <div className="pb-6 pt-4 sm:pt-8 lg:pb-14 lg:pt-20">
          <BackButton className="font-medium leading-relaxed text-black/50">
            Go Back
          </BackButton>
        </div>
        <form
          action=""
          aria-labelledby="checkout-heading"
          className="flex flex-col gap-8 rounded-lg bg-white px-6 pb-8 pt-6"
        >
          <h1
            id="checkout-heading"
            className="text-[28px] font-bold uppercase leading-snug tracking-[0.035em]"
          >
            Checkout
          </h1>
          <div className="flex flex-col gap-4">
            <h2 className="text-[13px] font-bold uppercase leading-[1.9] tracking-[0.06em] text-orange-500">
              Billing Details
            </h2>
            <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <TextField>
                <TextFieldLabel>Name</TextFieldLabel>
                <TextFieldInput
                  type="text"
                  autoComplete="name"
                  name="name"
                  placeholder="Alexei Ward"
                />
              </TextField>
              <TextField>
                <TextFieldLabel>Email Address</TextFieldLabel>
                <TextFieldInput
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  name="email"
                  placeholder="alexei@mail.com"
                />
              </TextField>
              <TextField>
                <TextFieldLabel>Phone Number</TextFieldLabel>
                <TextFieldInput
                  type="tel"
                  autoComplete="tel"
                  inputMode="tel"
                  name="phone"
                  placeholder="+1 202-555-0136"
                />
              </TextField>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <h2 className="text-[13px] font-bold uppercase leading-[1.9] tracking-[0.06em] text-orange-500">
              Shipping Info
            </h2>
            <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <TextField colSpan="full">
                <TextFieldLabel>Your Address</TextFieldLabel>
                <TextFieldInput
                  type="text"
                  autoComplete="street-address"
                  name="address"
                  placeholder="1137 Williams Avenue"
                />
              </TextField>
              <TextField>
                <TextFieldLabel>Zip Code</TextFieldLabel>
                <TextFieldInput
                  type="text"
                  autoComplete="postal-code"
                  name="zip"
                  placeholder="10001"
                />
              </TextField>
              <TextField>
                <TextFieldLabel>City</TextFieldLabel>
                <TextFieldInput
                  type="text"
                  autoComplete="address-level2"
                  name="city"
                  placeholder="New York"
                />
              </TextField>
              <TextField>
                <TextFieldLabel>Country</TextFieldLabel>
                <TextFieldInput
                  type="text"
                  autoComplete="country-name"
                  name="country"
                  placeholder="United States"
                />
              </TextField>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <h2 className="text-[13px] font-bold uppercase leading-[1.9] tracking-[0.06em] text-orange-500">
              Payment Details
            </h2>
            <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <fieldset className="col-span-full grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="text-xs font-bold leading-snug -tracking-[0.02em]">
                  Payment Method
                </div>
                <label className="col-start-2 flex items-center gap-4 rounded-lg border px-4 py-5 text-sm font-bold leading-snug">
                  <input type="radio" name="payment-method" value="eMoney" />
                  <span className="-translate-y-[1px]">e-Money</span>
                </label>
                <label className="col-start-2 flex items-center gap-4 rounded-lg border px-4 py-5 text-sm font-bold leading-snug">
                  <input type="radio" name="payment-method" value="cash" />
                  <span>Cash on Delivery</span>
                </label>
              </fieldset>
              <TextField>
                <TextFieldLabel>e-Money Number</TextFieldLabel>
                <TextFieldInput
                  type="text"
                  inputMode="numeric"
                  name="eMoney"
                  placeholder="238521993"
                />
              </TextField>
              <TextField>
                <TextFieldLabel>e-Money PIN</TextFieldLabel>
                <TextFieldInput
                  type="text"
                  inputMode="numeric"
                  name="eMoneyPin"
                  placeholder="6891"
                />
              </TextField>
              <div className="col-span-2 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                <CashOnDeliveryIcon className="h-12 w-12 shrink-0 text-orange-500" />
                <p className="max-w-prose text-[15px] font-medium leading-relaxed text-black/50">
                  The &lsquo;Cash on Delivery&rsquo; option enables you to pay
                  in cash when our delivery courier arrives at your residence.
                  Just make sure your address is correct so that your order will
                  not be cancelled.
                </p>
              </div>
            </div>
          </div>
        </form>
      </CenterContent>
    </div>
  )
}

function CashOnDeliveryIcon({ className }: { className?: string }) {
  return (
    <Svg viewBox="0 0 48 48" className={className}>
      <path
        fill="currentColor"
        d="M46.594 8.438H42.28c-.448 0-.869.213-1.134.574l-2.694 3.674a1.15 1.15 0 1 1-1.848-1.37c2.568-3.53 2.864-3.545 2.864-4.285 0-.779-.636-1.406-1.407-1.406h-5.404a17.658 17.658 0 0 1 9.606-2.813h4.33a1.406 1.406 0 0 0 0-2.812h-4.33c-5.277 0-10.33 2.02-14.142 5.625h-8.34c-.777 0-1.407.63-1.407 1.406v9.938h-8.53c-.777 0-1.406.63-1.406 1.406v15.6a14.053 14.053 0 0 0-7.824 3.089 1.406 1.406 0 1 0 1.772 2.185 11.226 11.226 0 0 1 7.048-2.499h3.129a1.407 1.407 0 0 1 0 2.813H8.436a1.406 1.406 0 0 0 0 2.812h13.728a4.226 4.226 0 0 1-3.977 2.813H1.405a1.406 1.406 0 0 0 0 2.812h16.782c3.395 0 6.236-2.42 6.89-5.625h7.36c.776 0 1.406-.63 1.406-1.406V25.312h9.843c.777 0 1.407-.63 1.407-1.406V11.25h1.5a1.406 1.406 0 0 0 0-2.813ZM33.61 17.599a1.404 1.404 0 0 0-1.172-.63h-3.085c-1.084-1.834.241-4.172 2.381-4.172 2.531 0 3.708 3.115 1.876 4.802ZM21.188 8.437h14.06c-.744 1.03-1.057 1.305-1.352 1.983-4.216-1.779-8.726 2.057-7.559 6.549h-5.15V8.437ZM19.78 19.782h2.813v5.625H19.78v-5.625Zm11.25 19.782H16.54c.969-2.735-1.07-5.626-3.979-5.626H11.25V19.782h5.719v7.032c0 .776.63 1.406 1.406 1.406H24c.777 0 1.406-.63 1.406-1.407v-7.03h5.625v19.78ZM33.844 22.5v-1.771a5.56 5.56 0 0 0 3.453-4.769 3.954 3.954 0 0 0 3.424-1.611l1.56-2.127V22.5h-8.437Z"
      />
    </Svg>
  )
}
