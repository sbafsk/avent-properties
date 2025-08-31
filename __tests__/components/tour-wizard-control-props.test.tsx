import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { TourWizardControlProps, useTourWizardControlProps } from '@/components/tour-wizard-control-props'
import { TourWizardData } from '@/components/tour-wizard-control-props'

// Mock DatePicker component
jest.mock('@/components/date-picker', () => ({
    DatePicker: ({ selectedDate, onDateSelect, selectedTime, onTimeSelect }: any) => (
        <div>
            <input
                data-testid="date-picker"
                value={selectedDate ? selectedDate.toISOString().split('T')[0] : ''}
                onChange={(e) => onDateSelect(new Date(e.target.value))}
                placeholder="Select tour date"
            />
            <input
                data-testid="time-picker"
                value={selectedTime || ''}
                onChange={(e) => onTimeSelect(e.target.value)}
                placeholder="e.g., 10:00 AM, 2:00 PM"
            />
        </div>
    ),
}))

// Mock Next.js router
jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: jest.fn(),
        replace: jest.fn(),
    }),
}))

describe('TourWizardControlProps', () => {
    const mockOnSubmit = jest.fn()
    const mockOnCancel = jest.fn()
    const mockOnStepChange = jest.fn()
    const mockOnDataChange = jest.fn()
    const mockOnSubmittingChange = jest.fn()
    const mockOnErrorsChange = jest.fn()

    beforeEach(() => {
        jest.clearAllMocks()
    })

    describe('Uncontrolled Mode (Internal State)', () => {
        it('should render with default internal state', () => {
            render(<TourWizardControlProps onSubmit={mockOnSubmit} />)

            expect(screen.getByText('Step 1 of 5')).toBeInTheDocument()
            expect(screen.getByText('Property Preferences')).toBeInTheDocument()
            expect(screen.getByText('Tell us about your ideal property')).toBeInTheDocument()
        })

        it('should navigate between steps using internal state', () => {
            render(<TourWizardControlProps onSubmit={mockOnSubmit} />)

            // Fill required fields for step 1
            fireEvent.change(screen.getByPlaceholderText('e.g., Apartment, House, Villa'), {
                target: { value: 'Apartment' }
            })
            fireEvent.change(screen.getByPlaceholderText('e.g., Punta del Este, La Barra'), {
                target: { value: 'Punta del Este' }
            })

            // Click Next
            fireEvent.click(screen.getByText('Next'))

            expect(screen.getByText('Step 2 of 5')).toBeInTheDocument()
            expect(screen.getByText('Schedule Your Tour')).toBeInTheDocument()
        })

        it('should update form data in internal state', () => {
            render(<TourWizardControlProps onSubmit={mockOnSubmit} />)

            const propertyTypeInput = screen.getByPlaceholderText('e.g., Apartment, House, Villa')
            fireEvent.change(propertyTypeInput, { target: { value: 'Villa' } })

            expect(propertyTypeInput).toHaveValue('Villa')
        })

        it('should validate required fields', () => {
            render(<TourWizardControlProps onSubmit={mockOnSubmit} />)

            // Try to go to next step without filling required fields
            fireEvent.click(screen.getByText('Next'))

            expect(screen.getByText('Property type is required')).toBeInTheDocument()
            expect(screen.getByText('Location is required')).toBeInTheDocument()
        })

        it('should submit form successfully', async () => {
            mockOnSubmit.mockResolvedValue(undefined)

            render(<TourWizardControlProps onSubmit={mockOnSubmit} />)

            // Fill all required fields and navigate to submit step
            fireEvent.change(screen.getByPlaceholderText('e.g., Apartment, House, Villa'), {
                target: { value: 'Apartment' }
            })
            fireEvent.change(screen.getByPlaceholderText('e.g., Punta del Este, La Barra'), {
                target: { value: 'Punta del Este' }
            })
            fireEvent.click(screen.getByText('Next'))

            // Step 2
            fireEvent.change(screen.getByTestId('date-picker'), {
                target: { value: '2024-12-25' }
            })
            fireEvent.change(screen.getByPlaceholderText('e.g., 10:00 AM, 2:00 PM'), {
                target: { value: '10:00 AM' }
            })
            fireEvent.click(screen.getByText('Next'))

            // Step 3 - Fill required fields using more specific selectors
            const inputs = screen.getAllByDisplayValue('')
            fireEvent.change(inputs[0], { target: { value: 'John' } }) // First name
            fireEvent.change(inputs[1], { target: { value: 'Doe' } }) // Last name
            fireEvent.change(inputs[2], { target: { value: 'john@example.com' } }) // Email
            fireEvent.click(screen.getByText('Next'))

            // Step 4
            fireEvent.change(screen.getByPlaceholderText('e.g., $200,000 - $500,000'), {
                target: { value: '$300,000' }
            })
            fireEvent.change(screen.getByPlaceholderText('e.g., Within 3 months, 6 months, 1 year'), {
                target: { value: '3 months' }
            })
            fireEvent.click(screen.getByText('Next'))

            // Step 5 - Submit
            fireEvent.click(screen.getByText('Submit Request'))

            await waitFor(() => {
                expect(mockOnSubmit).toHaveBeenCalledWith(
                    expect.objectContaining({
                        propertyType: 'Apartment',
                        location: 'Punta del Este',
                        firstName: 'John',
                        lastName: 'Doe',
                        email: 'john@example.com',
                        budget: '$300,000',
                        timeline: '3 months',
                    })
                )
            })
        })
    })

    describe('Controlled Mode (External State)', () => {
        const controlledFormData: TourWizardData = {
            propertyType: 'House',
            location: 'La Barra',
            tourDate: new Date('2024-12-25'),
            tourTime: '2:00 PM',
            tourType: 'in-person',
            firstName: 'Jane',
            lastName: 'Smith',
            email: 'jane@example.com',
            phone: '+598 99 123 456',
            nationality: 'American',
            specialRequests: 'Pool required',
            budget: '$500,000',
            timeline: '6 months',
        }

        it('should use controlled props when provided', () => {
            render(
                <TourWizardControlProps
                    currentStep={2}
                    formData={controlledFormData}
                    isSubmitting={false}
                    errors={{}}
                    onStepChange={mockOnStepChange}
                    onDataChange={mockOnDataChange}
                    onSubmittingChange={mockOnSubmittingChange}
                    onErrorsChange={mockOnErrorsChange}
                    onSubmit={mockOnSubmit}
                />
            )

            expect(screen.getByText('Step 2 of 5')).toBeInTheDocument()
            expect(screen.getByTestId('time-picker')).toHaveValue('2:00 PM') // Tour time from controlled data
        })

        it('should call controlled change handlers', () => {
            render(
                <TourWizardControlProps
                    currentStep={1}
                    formData={controlledFormData}
                    onStepChange={mockOnStepChange}
                    onDataChange={mockOnDataChange}
                    onSubmit={mockOnSubmit}
                />
            )

            // Change form data
            fireEvent.change(screen.getByDisplayValue('House'), {
                target: { value: 'Villa' }
            })

            expect(mockOnDataChange).toHaveBeenCalledWith(
                expect.objectContaining({
                    propertyType: 'Villa',
                    location: 'La Barra',
                })
            )
        })

        it('should call onStepChange when navigating', () => {
            render(
                <TourWizardControlProps
                    currentStep={1}
                    formData={controlledFormData}
                    onStepChange={mockOnStepChange}
                    onSubmit={mockOnSubmit}
                />
            )

            fireEvent.click(screen.getByText('Next'))

            expect(mockOnStepChange).toHaveBeenCalledWith(2)
        })

        it('should handle controlled errors', () => {
            const controlledErrors = {
                firstName: 'First name is required',
                email: 'Invalid email format',
            }

            render(
                <TourWizardControlProps
                    currentStep={3} // Step 3 has firstName and email fields
                    formData={controlledFormData}
                    errors={controlledErrors}
                    onErrorsChange={mockOnErrorsChange}
                    onSubmit={mockOnSubmit}
                />
            )

            expect(screen.getByText('First name is required')).toBeInTheDocument()
            expect(screen.getByText('Invalid email format')).toBeInTheDocument()
        })

        it('should handle controlled submitting state', () => {
            render(
                <TourWizardControlProps
                    currentStep={5}
                    formData={controlledFormData}
                    isSubmitting={true}
                    onSubmittingChange={mockOnSubmittingChange}
                    onSubmit={mockOnSubmit}
                />
            )

            expect(screen.getByText('Submitting...')).toBeInTheDocument()
            expect(screen.getByText('Submitting...')).toBeDisabled()
        })
    })

    describe('Mixed Control (Some props controlled, others not)', () => {
        it('should handle mixed controlled and uncontrolled props', () => {
            render(
                <TourWizardControlProps
                    currentStep={2} // Controlled
                    // formData not provided (uncontrolled)
                    onStepChange={mockOnStepChange}
                    onSubmit={mockOnSubmit}
                />
            )

            expect(screen.getByText('Step 2 of 5')).toBeInTheDocument()
            expect(screen.getByText('Schedule Your Tour')).toBeInTheDocument()

            // Should be able to change form data (uncontrolled)
            const tourTimeInput = screen.getByTestId('time-picker')
            fireEvent.change(tourTimeInput, { target: { value: '3:00 PM' } })
            expect(tourTimeInput).toHaveValue('3:00 PM')
        })
    })

    describe('useTourWizardControlProps Hook', () => {
        it('should provide controlled props with internal state management', () => {
            const TestComponent = () => {
                const controlProps = useTourWizardControlProps({
                    onSubmit: mockOnSubmit,
                })

                return <TourWizardControlProps {...controlProps} />
            }

            render(<TestComponent />)

            expect(screen.getByText('Step 1 of 5')).toBeInTheDocument()
            expect(screen.getByText('Property Preferences')).toBeInTheDocument()
        })

        it('should allow overriding hook props', () => {
            const TestComponent = () => {
                const controlProps = useTourWizardControlProps({
                    currentStep: 3,
                    onSubmit: mockOnSubmit,
                })

                return <TourWizardControlProps {...controlProps} />
            }

            render(<TestComponent />)

            expect(screen.getByText('Step 3 of 5')).toBeInTheDocument()
            expect(screen.getByText('Contact Information')).toBeInTheDocument()
        })
    })

    describe('Error Handling', () => {
        it('should handle submit errors', async () => {
            const submitError = new Error('Network error')
            mockOnSubmit.mockRejectedValue(submitError)

            render(<TourWizardControlProps onSubmit={mockOnSubmit} />)

            // Navigate to submit step by filling required fields
            fireEvent.change(screen.getByPlaceholderText('e.g., Apartment, House, Villa'), {
                target: { value: 'Apartment' }
            })
            fireEvent.change(screen.getByPlaceholderText('e.g., Punta del Este, La Barra'), {
                target: { value: 'Punta del Este' }
            })
            fireEvent.click(screen.getByText('Next'))

            // Step 2 - Fill required fields
            fireEvent.change(screen.getByTestId('date-picker'), {
                target: { value: '2024-12-25' }
            })
            fireEvent.change(screen.getByTestId('time-picker'), {
                target: { value: '10:00 AM' }
            })
            fireEvent.click(screen.getByText('Next'))

            // Step 3 - Fill required fields
            const inputs = screen.getAllByDisplayValue('')
            fireEvent.change(inputs[0], { target: { value: 'John' } }) // First name
            fireEvent.change(inputs[1], { target: { value: 'Doe' } }) // Last name
            fireEvent.change(inputs[2], { target: { value: 'john@example.com' } }) // Email
            fireEvent.click(screen.getByText('Next'))

            // Step 4 - Fill required fields
            fireEvent.change(screen.getByPlaceholderText('e.g., $200,000 - $500,000'), {
                target: { value: '$300,000' }
            })
            fireEvent.change(screen.getByPlaceholderText('e.g., Within 3 months, 6 months, 1 year'), {
                target: { value: '3 months' }
            })
            fireEvent.click(screen.getByText('Next'))

            // Step 5 - Submit
            fireEvent.click(screen.getByText('Submit Request'))

            await waitFor(() => {
                expect(screen.getByText('Network error')).toBeInTheDocument()
            })
        })

        it('should handle cancel action', () => {
            render(
                <TourWizardControlProps
                    onSubmit={mockOnSubmit}
                    onCancel={mockOnCancel}
                />
            )

            fireEvent.click(screen.getByText('Cancel'))

            expect(mockOnCancel).toHaveBeenCalled()
        })
    })

    describe('Accessibility', () => {
        it('should have proper ARIA labels and roles', () => {
            render(<TourWizardControlProps onSubmit={mockOnSubmit} />)

            expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument()
            expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument()
        })

        it('should show progress indicator', () => {
            render(<TourWizardControlProps onSubmit={mockOnSubmit} />)

            expect(screen.getByText('20% Complete')).toBeInTheDocument()
            expect(screen.getByText('Step 1 of 5')).toBeInTheDocument()
        })
    })

    describe('Custom Props', () => {
        it('should accept custom totalSteps', () => {
            render(
                <TourWizardControlProps
                    totalSteps={3}
                    onSubmit={mockOnSubmit}
                />
            )

            expect(screen.getByText('Step 1 of 3')).toBeInTheDocument()
        })

        it('should accept custom className', () => {
            const { container } = render(
                <TourWizardControlProps
                    className="custom-wizard"
                    onSubmit={mockOnSubmit}
                />
            )

            expect(container.firstChild).toHaveClass('custom-wizard')
        })
    })
})
