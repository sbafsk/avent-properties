import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { InputField } from '@/components/ui/input-field'

describe('InputField', () => {
  const defaultProps = {
    label: 'Test Input',
    name: 'test',
    placeholder: 'Enter test value'
  }

  it('renders with label and placeholder', () => {
    render(<InputField {...defaultProps} />)

    expect(screen.getByLabelText('Test Input')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter test value')).toBeInTheDocument()
  })

  it('shows required indicator when required is true', () => {
    render(<InputField {...defaultProps} required />)

    expect(screen.getByText('*')).toBeInTheDocument()
  })

  it('displays error message when error is provided', () => {
    const errorMessage = 'This field is required'
    render(<InputField {...defaultProps} error={errorMessage} />)

    expect(screen.getByText(errorMessage)).toBeInTheDocument()
    expect(screen.getByText(errorMessage)).toHaveAttribute('role', 'alert')
  })

  it('displays description when provided', () => {
    const description = 'This is a helpful description'
    render(<InputField {...defaultProps} description={description} />)

    expect(screen.getByText(description)).toBeInTheDocument()
  })

  it('applies error styling when error is present', () => {
    render(<InputField {...defaultProps} error="Error message" />)

    const input = screen.getByRole('textbox')
    expect(input).toHaveClass('border-red-500')
  })

  it('applies disabled styling when disabled is true', () => {
    render(<InputField {...defaultProps} disabled />)

    const input = screen.getByRole('textbox')
    expect(input).toBeDisabled()
    expect(input).toHaveClass('opacity-50')
  })

  it('calls onChange when input value changes', () => {
    const handleChange = jest.fn()
    render(<InputField {...defaultProps} onChange={handleChange} />)

    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'new value' } })

    expect(handleChange).toHaveBeenCalledWith('new value')
  })

  it('has proper accessibility attributes', () => {
    render(<InputField {...defaultProps} required error="Error" description="Help" />)

    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('aria-required', 'true')
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(input).toHaveAttribute('aria-describedby')
  })

  it('supports different input types', () => {
        const { rerender } = render(<InputField {...defaultProps} type="email" />)
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email')
    
    rerender(<InputField {...defaultProps} type="password" />)
    // Password inputs don't have 'textbox' role, they have 'textbox' role but are type="password"
    const passwordInput = screen.getByDisplayValue('')
    expect(passwordInput).toHaveAttribute('type', 'password')
  })
})
