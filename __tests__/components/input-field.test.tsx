import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import {
    InputField,
    useInputField,
    EmailInput,
    PasswordInput,
    PhoneInput
} from '@/components/input-field'

// Mock Next.js router
jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: jest.fn(),
        replace: jest.fn(),
    }),
}))

describe('InputField', () => {
    const mockOnChange = jest.fn()
    const mockOnFocus = jest.fn()
    const mockOnBlur = jest.fn()

    beforeEach(() => {
        jest.clearAllMocks()
    })

    describe('Basic Functionality', () => {
        it('should render with basic props', () => {
            render(
                <InputField
                    label="Test Input"
                    value=""
                    onChange={mockOnChange}
                />
            )

            expect(screen.getByLabelText('Test Input')).toBeInTheDocument()
            expect(screen.getByRole('textbox')).toBeInTheDocument()
        })

        it('should display label and required indicator', () => {
            render(
                <InputField
                    label="Required Field"
                    value=""
                    onChange={mockOnChange}
                    required
                />
            )

            expect(screen.getByText('Required Field')).toBeInTheDocument()
            expect(screen.getByText('*')).toBeInTheDocument()
        })

        it('should handle value changes', () => {
            render(
                <InputField
                    label="Test Input"
                    value=""
                    onChange={mockOnChange}
                />
            )

            const input = screen.getByRole('textbox')
            fireEvent.change(input, { target: { value: 'test value' } })

            expect(mockOnChange).toHaveBeenCalledWith('test value')
        })

        it('should handle focus and blur events', () => {
            render(
                <InputField
                    label="Test Input"
                    value=""
                    onChange={mockOnChange}
                    onFocus={mockOnFocus}
                    onBlur={mockOnBlur}
                />
            )

            const input = screen.getByRole('textbox')

            fireEvent.focus(input)
            expect(mockOnFocus).toHaveBeenCalled()

            fireEvent.blur(input)
            expect(mockOnBlur).toHaveBeenCalled()
        })
    })

    describe('Validation and Error Handling', () => {
        it('should display error message', () => {
            render(
                <InputField
                    label="Test Input"
                    value=""
                    onChange={mockOnChange}
                    error="This field is required"
                />
            )

            expect(screen.getByText('This field is required')).toBeInTheDocument()
            expect(screen.getByRole('alert')).toBeInTheDocument()
        })

        it('should show validation icon for errors', () => {
            render(
                <InputField
                    label="Test Input"
                    value=""
                    onChange={mockOnChange}
                    error="Error message"
                />
            )

            // Check for error icon (AlertCircle)
            expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true')
        })

        it('should show success state for valid input', () => {
            render(
                <InputField
                    label="Test Input"
                    value="valid input"
                    onChange={mockOnChange}
                />
            )

            const input = screen.getByRole('textbox')
            fireEvent.blur(input) // Mark as touched

            // Should show success message after validation
            expect(screen.getByText('Looks good!')).toBeInTheDocument()
        })

        it('should validate with custom validation rules', () => {
            const customValidation = {
                minLength: 5,
                custom: (value: string) => {
                    if (value.length < 5) return 'Too short'
                    return null
                }
            }

            render(
                <InputField
                    label="Test Input"
                    value=""
                    onChange={mockOnChange}
                    validation={customValidation}
                />
            )

            const input = screen.getByRole('textbox')
            fireEvent.change(input, { target: { value: 'hi' } })
            fireEvent.blur(input)

            expect(screen.getByText('Too short')).toBeInTheDocument()
        })
    })

    describe('Password Input', () => {
        it('should toggle password visibility', () => {
            render(
                <InputField
                    label="Password"
                    type="password"
                    value="password123"
                    onChange={mockOnChange}
                />
            )

            const toggleButton = screen.getByLabelText('Show password')
            const input = screen.getByDisplayValue('password123')

            expect(input).toHaveAttribute('type', 'password')

            fireEvent.click(toggleButton)
            expect(input).toHaveAttribute('type', 'text')
            expect(screen.getByLabelText('Hide password')).toBeInTheDocument()
        })
    })

    describe('Accessibility', () => {
        it('should have proper ARIA attributes', () => {
            render(
                <InputField
                    label="Test Input"
                    value=""
                    onChange={mockOnChange}
                    required
                    error="Error message"
                />
            )

            const input = screen.getByRole('textbox')
            expect(input).toHaveAttribute('aria-required', 'true')
            expect(input).toHaveAttribute('aria-invalid', 'true')
            expect(input).toHaveAttribute('aria-describedby')
        })

        it('should associate label with input', () => {
            render(
                <InputField
                    label="Test Input"
                    value=""
                    onChange={mockOnChange}
                    id="test-input"
                />
            )

            const input = screen.getByRole('textbox')
            const label = screen.getByText('Test Input')

            expect(input).toHaveAttribute('id', 'test-input')
            expect(label).toHaveAttribute('for', 'test-input')
        })
    })

    describe('Icon Support', () => {
        it('should display icon when provided', () => {
            const TestIcon = () => <span data-testid="test-icon">📧</span>

            render(
                <InputField
                    label="Email"
                    value=""
                    onChange={mockOnChange}
                    icon={<TestIcon />}
                />
            )

            expect(screen.getByTestId('test-icon')).toBeInTheDocument()
        })
    })
})

describe('useInputField Hook', () => {
    const mockOnChange = jest.fn()

    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('should provide prop collections', () => {
        const TestComponent = () => {
            const { inputProps, labelProps, containerProps } = useInputField({
                label: 'Test Input',
                value: 'test',
                onChange: mockOnChange,
            })

            return (
                <div {...containerProps}>
                    <label {...labelProps}>Test Input</label>
                    <input {...inputProps} />
                </div>
            )
        }

        render(<TestComponent />)

        expect(screen.getByDisplayValue('test')).toBeInTheDocument()
        expect(screen.getByText('Test Input')).toBeInTheDocument()
    })

    it('should provide prop getters for composition', () => {
        const TestComponent = () => {
            const { getInputProps, getLabelProps } = useInputField({
                label: 'Test Input',
                value: 'test',
                onChange: mockOnChange,
            })

            return (
                <div>
                    <label {...getLabelProps({ className: 'custom-label' })}>Test Input</label>
                    <input {...getInputProps({ className: 'custom-input' })} />
                </div>
            )
        }

        render(<TestComponent />)

        const input = screen.getByDisplayValue('test')
        const label = screen.getByText('Test Input')

        expect(input).toHaveClass('custom-input')
        expect(label).toHaveClass('custom-label')
    })

    it('should handle event handler composition', () => {
        const mockCustomOnChange = jest.fn()

        const TestComponent = () => {
            const { getInputProps } = useInputField({
                label: 'Test Input',
                value: '',
                onChange: mockOnChange,
            })

            return (
                <input {...getInputProps({ onChange: mockCustomOnChange })} />
            )
        }

        render(<TestComponent />)

        const input = screen.getByRole('textbox')
        fireEvent.change(input, { target: { value: 'test' } })

        expect(mockOnChange).toHaveBeenCalledWith('test')
        expect(mockCustomOnChange).toHaveBeenCalled()
    })

    it('should provide validation state', () => {
        const TestComponent = () => {
            const { state, hasError, isValid } = useInputField({
                label: 'Test Input',
                value: 'test',
                onChange: mockOnChange,
                error: 'Test error',
            })

            return (
                <div>
                    <span data-testid="has-error">{hasError.toString()}</span>
                    <span data-testid="is-valid">{isValid.toString()}</span>
                    <span data-testid="error">{state.error}</span>
                </div>
            )
        }

        render(<TestComponent />)

        expect(screen.getByTestId('has-error')).toHaveTextContent('true')
        expect(screen.getByTestId('is-valid')).toHaveTextContent('false')
        expect(screen.getByTestId('error')).toHaveTextContent('Test error')
    })
})

describe('Specialized Input Components', () => {
    const mockOnChange = jest.fn()

    beforeEach(() => {
        jest.clearAllMocks()
    })

    describe('EmailInput', () => {
        it('should validate email format', () => {
            const TestComponent = () => {
                const [value, setValue] = React.useState('')
                return (
                    <EmailInput
                        label="Email"
                        value={value}
                        onChange={setValue}
                    />
                )
            }

            render(<TestComponent />)

            const input = screen.getByRole('textbox')
            fireEvent.change(input, { target: { value: 'invalid-email' } })
            fireEvent.blur(input)

            expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument()
        })

        it('should accept valid email', () => {
            const TestComponent = () => {
                const [value, setValue] = React.useState('')
                return (
                    <EmailInput
                        label="Email"
                        value={value}
                        onChange={setValue}
                    />
                )
            }

            render(<TestComponent />)

            const input = screen.getByRole('textbox')
            fireEvent.change(input, { target: { value: 'test@example.com' } })
            fireEvent.blur(input)

            expect(screen.queryByText('Please enter a valid email address')).not.toBeInTheDocument()
        })

        it('should have email autocomplete', () => {
            render(
                <EmailInput
                    label="Email"
                    value=""
                    onChange={mockOnChange}
                />
            )

            expect(screen.getByRole('textbox')).toHaveAttribute('autocomplete', 'email')
        })
    })

    describe('PasswordInput', () => {
        it('should validate password strength', () => {
            const TestComponent = () => {
                const [value, setValue] = React.useState('')
                return (
                    <PasswordInput
                        label="Password"
                        value={value}
                        onChange={setValue}
                    />
                )
            }

            render(<TestComponent />)

            const input = screen.getByDisplayValue('')
            fireEvent.change(input, { target: { value: 'weak' } })
            fireEvent.blur(input)

            expect(screen.getByText('Password must be at least 8 characters long')).toBeInTheDocument()
        })

        it('should validate password complexity', () => {
            const TestComponent = () => {
                const [value, setValue] = React.useState('')
                return (
                    <PasswordInput
                        label="Password"
                        value={value}
                        onChange={setValue}
                    />
                )
            }

            render(<TestComponent />)

            const input = screen.getByDisplayValue('')
            fireEvent.change(input, { target: { value: 'longpassword' } })
            fireEvent.blur(input)

            expect(screen.getByText('Password must contain uppercase, lowercase, and number')).toBeInTheDocument()
        })

        it('should accept strong password', () => {
            render(
                <PasswordInput
                    label="Password"
                    value=""
                    onChange={mockOnChange}
                />
            )

            const input = screen.getByDisplayValue('')
            fireEvent.change(input, { target: { value: 'StrongPass123' } })
            fireEvent.blur(input)

            expect(screen.queryByText(/Password must/)).not.toBeInTheDocument()
        })

        it('should have password autocomplete', () => {
            render(
                <PasswordInput
                    label="Password"
                    value=""
                    onChange={mockOnChange}
                />
            )

            expect(screen.getByDisplayValue('')).toHaveAttribute('autocomplete', 'new-password')
        })
    })

    describe('PhoneInput', () => {
        it('should validate phone format', () => {
            const TestComponent = () => {
                const [value, setValue] = React.useState('')
                return (
                    <PhoneInput
                        label="Phone"
                        value={value}
                        onChange={setValue}
                    />
                )
            }

            render(<TestComponent />)

            const input = screen.getByRole('textbox')
            fireEvent.change(input, { target: { value: 'invalid-phone' } })
            fireEvent.blur(input)

            expect(screen.getByText('Please enter a valid phone number')).toBeInTheDocument()
        })

        it('should validate phone length', () => {
            const TestComponent = () => {
                const [value, setValue] = React.useState('')
                return (
                    <PhoneInput
                        label="Phone"
                        value={value}
                        onChange={setValue}
                    />
                )
            }

            render(<TestComponent />)

            const input = screen.getByRole('textbox')
            fireEvent.change(input, { target: { value: '123' } })
            fireEvent.blur(input)

            expect(screen.getByText('Phone number must be at least 10 digits')).toBeInTheDocument()
        })

        it('should accept valid phone number', () => {
            render(
                <PhoneInput
                    label="Phone"
                    value=""
                    onChange={mockOnChange}
                />
            )

            const input = screen.getByRole('textbox')
            fireEvent.change(input, { target: { value: '+1 (555) 123-4567' } })
            fireEvent.blur(input)

            expect(screen.queryByText(/Please enter a valid phone number/)).not.toBeInTheDocument()
        })

        it('should have tel autocomplete', () => {
            render(
                <PhoneInput
                    label="Phone"
                    value=""
                    onChange={mockOnChange}
                />
            )

            expect(screen.getByRole('textbox')).toHaveAttribute('autocomplete', 'tel')
        })
    })
})

describe('Prop Getters Composition', () => {
    const mockOnChange = jest.fn()

    it('should allow custom event handlers to be composed', () => {
        const mockCustomOnFocus = jest.fn()
        const mockCustomOnBlur = jest.fn()

        const TestComponent = () => {
            const { getInputProps } = useInputField({
                label: 'Test Input',
                value: '',
                onChange: mockOnChange,
                onFocus: mockCustomOnFocus,
                onBlur: mockCustomOnBlur,
            })

            return <input {...getInputProps()} />
        }

        render(<TestComponent />)

        const input = screen.getByRole('textbox')

        fireEvent.focus(input)
        expect(mockCustomOnFocus).toHaveBeenCalled()

        fireEvent.blur(input)
        expect(mockCustomOnBlur).toHaveBeenCalled()
    })

    it('should merge custom props with default props', () => {
        const TestComponent = () => {
            const { getInputProps } = useInputField({
                label: 'Test Input',
                value: 'test',
                onChange: mockOnChange,
            })

            return (
                <input
                    {...getInputProps({
                        'data-testid': 'custom-input',
                        className: 'custom-class'
                    })}
                />
            )
        }

        render(<TestComponent />)

        const input = screen.getByTestId('custom-input')
        expect(input).toHaveClass('custom-class')
        expect(input).toHaveValue('test')
    })
})
