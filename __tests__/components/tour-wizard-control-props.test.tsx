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

// Mock MultiSelect component to avoid Command component issues in tests
jest.mock('@/components/ui/multi-select', () => ({
    MultiSelect: ({ options, selected, onChange, placeholder }: any) => {
        const [localSelected, setLocalSelected] = React.useState(selected || []);

        const handleOptionClick = (optionValue: string) => {
            const newSelected = localSelected.includes(optionValue)
                ? localSelected.filter(item => item !== optionValue)
                : [...localSelected, optionValue];

            setLocalSelected(newSelected);
            onChange(newSelected);
        };

        return (
            <div>
                <button
                    data-testid="multi-select-trigger"
                    onClick={() => {
                        // Just simulate opening the dropdown, don't auto-select
                    }}
                >
                    {placeholder}
                </button>
                <div data-testid="multi-select-options">
                    {options.map((option: any) => (
                        <button
                            key={option.value}
                            data-testid={`option-${option.value}`}
                            onClick={() => handleOptionClick(option.value)}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
                {localSelected.length > 0 && (
                    <div data-testid="selected-items">
                        {localSelected.map((item: string) => (
                            <span key={item} data-testid={`selected-${item}`}>
                                {options.find((opt: any) => opt.value === item)?.label || item}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        );
    },
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

        it('should navigate between steps using internal state', async () => {
            render(<TourWizardControlProps onSubmit={mockOnSubmit} />)

            // Fill required fields for step 1 - using MultiSelect components
            const propertyTypeButtons = screen.getAllByTestId('multi-select-trigger')
            const propertyTypeButton = propertyTypeButtons[0] // First MultiSelect (Property Type)
            fireEvent.click(propertyTypeButton)

            const apartmentOption = screen.getByTestId('option-apartment')
            fireEvent.click(apartmentOption)

            // For location, we need to find the second MultiSelect component
            const locationButton = propertyTypeButtons[1] // Second MultiSelect (Location)
            fireEvent.click(locationButton)

            const puntaOption = screen.getByTestId('option-punta-del-este')
            fireEvent.click(puntaOption)

            // Wait for validation to clear and then click Next
            await waitFor(() => {
                expect(screen.queryByText('Property type is required')).not.toBeInTheDocument()
                expect(screen.queryByText('Location is required')).not.toBeInTheDocument()
            })

            // Click Next
            fireEvent.click(screen.getByText('Next'))

            expect(screen.getByText('Step 2 of 5')).toBeInTheDocument()
            expect(screen.getByText('Schedule Your Tour')).toBeInTheDocument()
        })

        it('should update form data in internal state', () => {
            render(<TourWizardControlProps onSubmit={mockOnSubmit} />)

            const propertyTypeButtons = screen.getAllByTestId('multi-select-trigger')
            const propertyTypeButton = propertyTypeButtons[0] // First MultiSelect (Property Type)
            fireEvent.click(propertyTypeButton)

            const villaOption = screen.getByTestId('option-villa')
            fireEvent.click(villaOption)

            // Check that Villa is selected
            expect(screen.getByTestId('selected-villa')).toBeInTheDocument()
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
            const propertyTypeButtons = screen.getAllByTestId('multi-select-trigger')
            const propertyTypeButton = propertyTypeButtons[0] // First MultiSelect (Property Type)
            fireEvent.click(propertyTypeButton)

            const apartmentOption = screen.getByTestId('option-apartment')
            fireEvent.click(apartmentOption)

            // For location, we need to find the second MultiSelect component
            const locationButton = propertyTypeButtons[1] // Second MultiSelect (Location)
            fireEvent.click(locationButton)

            const puntaOption = screen.getByTestId('option-punta-del-este')
            fireEvent.click(puntaOption)

            // Wait for validation to clear and then click Next
            await waitFor(() => {
                expect(screen.queryByText('Property type is required')).not.toBeInTheDocument()
                expect(screen.queryByText('Location is required')).not.toBeInTheDocument()
            })

            fireEvent.click(screen.getByText('Next'))

            // Step 2
            fireEvent.change(screen.getByTestId('date-picker'), {
                target: { value: '2025-12-25' }
            })
            fireEvent.change(screen.getByPlaceholderText('e.g., 10:00 AM, 2:00 PM'), {
                target: { value: '10:00 AM' }
            })

            // Select tour type
            const tourTypeSelect = screen.getByRole('combobox')
            fireEvent.change(tourTypeSelect, { target: { value: 'in-person' } })

            fireEvent.click(screen.getByText('Next'))

            // Step 3 - Fill required fields using more specific selectors
            const inputs = screen.getAllByDisplayValue('')
            fireEvent.change(inputs[0], { target: { value: 'John' } }) // First name
            fireEvent.change(inputs[1], { target: { value: 'Doe' } }) // Last name
            fireEvent.change(inputs[2], { target: { value: 'john@example.com' } }) // Email
            fireEvent.change(inputs[3], { target: { value: '+598 99 123 456' } }) // Phone
            fireEvent.change(inputs[4], { target: { value: 'American' } }) // Nationality
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
                        propertyType: ['apartment'],
                        location: ['punta-del-este'],
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
            propertyType: ['house'],
            location: ['la-barra'],
            tourDate: new Date('2025-12-25'),
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

            // Change form data using MultiSelect
            const propertyTypeButtons = screen.getAllByTestId('multi-select-trigger')
            const propertyTypeButton = propertyTypeButtons[0]
            fireEvent.click(propertyTypeButton)

            const villaOption = screen.getByTestId('option-villa')
            fireEvent.click(villaOption)

            expect(mockOnDataChange).toHaveBeenCalledWith(
                expect.objectContaining({
                    propertyType: ['house', 'villa'],
                    location: ['la-barra'],
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
            const propertyTypeButtons = screen.getAllByTestId('multi-select-trigger')
            const propertyTypeButton = propertyTypeButtons[0] // First MultiSelect (Property Type)
            fireEvent.click(propertyTypeButton)

            const apartmentOption = screen.getByTestId('option-apartment')
            fireEvent.click(apartmentOption)

            // For location, we need to find the second MultiSelect component
            const locationButton = propertyTypeButtons[1] // Second MultiSelect (Location)
            fireEvent.click(locationButton)

            const puntaOption = screen.getByTestId('option-punta-del-este')
            fireEvent.click(puntaOption)

            // Wait for validation to clear and then click Next
            await waitFor(() => {
                expect(screen.queryByText('Property type is required')).not.toBeInTheDocument()
                expect(screen.queryByText('Location is required')).not.toBeInTheDocument()
            })

            fireEvent.click(screen.getByText('Next'))

            // Step 2 - Fill required fields
            fireEvent.change(screen.getByTestId('date-picker'), {
                target: { value: '2025-12-25' }
            })
            fireEvent.change(screen.getByTestId('time-picker'), {
                target: { value: '10:00 AM' }
            })

            // Select tour type
            const tourTypeSelect = screen.getByRole('combobox')
            fireEvent.change(tourTypeSelect, { target: { value: 'in-person' } })

            fireEvent.click(screen.getByText('Next'))

            // Step 3 - Fill required fields
            const inputs = screen.getAllByDisplayValue('')
            fireEvent.change(inputs[0], { target: { value: 'John' } }) // First name
            fireEvent.change(inputs[1], { target: { value: 'Doe' } }) // Last name
            fireEvent.change(inputs[2], { target: { value: 'john@example.com' } }) // Email
            fireEvent.change(inputs[3], { target: { value: '+598 99 123 456' } }) // Phone
            fireEvent.change(inputs[4], { target: { value: 'American' } }) // Nationality
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
