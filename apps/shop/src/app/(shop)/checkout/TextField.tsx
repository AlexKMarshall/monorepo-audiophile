'use client'
import clsx from 'clsx'
import {
  type LabelHTMLAttributes,
  type ReactNode,
  createContext,
  useContext,
  useId,
  type InputHTMLAttributes,
} from 'react'

type TextFieldContext = {
  controlId: string
}
const TextFieldContext = createContext<TextFieldContext | null>(null)

function useTextFieldContext() {
  const context = useContext(TextFieldContext)
  if (!context) {
    throw new Error(
      `TextField subcomponents must be used within a TextField component`
    )
  }
  return context
}

type TextFieldProps = {
  children: ReactNode
  colSpan?: 'full'
}
export function TextField({ children, colSpan }: TextFieldProps) {
  const controlId = useId()

  return (
    <TextFieldContext.Provider value={{ controlId }}>
      <div
        className={clsx('flex flex-col gap-2', {
          'col-span-full': colSpan === 'full',
        })}
      >
        {children}
      </div>
    </TextFieldContext.Provider>
  )
}

export function TextFieldLabel(
  props: Omit<LabelHTMLAttributes<HTMLLabelElement>, 'htmlFor' | 'className'>
) {
  const { controlId } = useTextFieldContext()

  return (
    <label
      htmlFor={controlId}
      className="text-xs font-bold leading-snug -tracking-[0.02em]"
      {...props}
    />
  )
}

type TextFieldInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'id' | 'className' | 'type'
> & {
  type: 'text' | 'email' | 'tel'
}

export function TextFieldInput(props: TextFieldInputProps) {
  const { controlId } = useTextFieldContext()

  return (
    <input
      className="cursor-pointer rounded-lg border px-6 py-4 text-sm font-bold -tracking-[0.02em] caret-orange-500 placeholder:text-black/40"
      id={controlId}
      {...props}
    />
  )
}
