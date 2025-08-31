import '@testing-library/jest-dom'

declare global {
    namespace jest {
        interface Matchers<R> {
            toBeInTheDocument(): R
            toHaveClass(...className: string[]): R
            toHaveTextContent(text: string | RegExp): R
            toHaveAttribute(attr: string, value?: string): R
            toBeVisible(): R
            toBeDisabled(): R
            toBeEnabled(): R
            toHaveValue(value: string | string[] | number): R
            toBeChecked(): R
            toBePartiallyChecked(): R
            toHaveDescription(text?: string | RegExp): R
            toHaveAccessibleDescription(text?: string | RegExp): R
            toHaveAccessibleName(text?: string | RegExp): R
            toHaveFormValues(expectedValues: Record<string, any>): R
            toHaveDisplayValue(value: string | RegExp | (string | RegExp)[]): R
            toHaveStyle(css: string | Record<string, any>): R
            toHaveFocus(): R
            toBeRequired(): R
            toBeValid(): R
            toBeInvalid(): R
            toHaveErrorMessage(text?: string | RegExp): R
        }
    }
}
