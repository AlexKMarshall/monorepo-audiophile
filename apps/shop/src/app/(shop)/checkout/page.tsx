import { BackButton } from '~/components/BackButton'
import { CenterContent } from '~/components/CenterContent'
import { TextField, TextFieldInput, TextFieldLabel } from './TextField'

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
            <div className="flex flex-col gap-6">
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
            <TextField>
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
          <div className="flex flex-col gap-4">
            <h2 className="text-[13px] font-bold uppercase leading-[1.9] tracking-[0.06em] text-orange-500">
              Payment Details
            </h2>
            <fieldset>
              <legend>Payment Method</legend>
              <label>
                <input type="radio" name="payment-method" value="eMoney" />
                e-Money
              </label>
              <label>
                <input type="radio" name="payment-method" value="cash" />
                Cash on Delivery
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
            <p>
              The &lsquo;Cash on Delivery&rsquo; option enables you to pay in
              cash when our delivery courier arrives at your residence. Just
              make sure your address is correct so that your order will not be
              cancelled.
            </p>
          </div>
        </form>
      </CenterContent>
    </div>
  )
}
