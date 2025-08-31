"use client"

import React, { useState } from 'react'
import { 
  InputFieldAdvanced, 
  useInputField, 
  EmailInput, 
  PasswordInput, 
  PhoneInput 
} from '@/components/input-field-advanced'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Mail, Lock, Phone, User, MapPin } from 'lucide-react'

// Example 1: Basic Usage with Prop Collections
export function BasicInputExample() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  })

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Basic Form with Prop Collections</CardTitle>
        <CardDescription>
          Using pre-configured prop objects for consistent styling and behavior
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <InputFieldAdvanced
          label="Full Name"
          value={formData.name}
          onChange={(value) => setFormData(prev => ({ ...prev, name: value }))}
          placeholder="Enter your full name"
          required
          icon={<User className="h-4 w-4" />}
        />
        
        <EmailInput
          label="Email Address"
          value={formData.email}
          onChange={(value) => setFormData(prev => ({ ...prev, email: value }))}
          placeholder="Enter your email"
          required
          icon={<Mail className="h-4 w-4" />}
        />
        
        <PasswordInput
          label="Password"
          value={formData.password}
          onChange={(value) => setFormData(prev => ({ ...prev, password: value }))}
          placeholder="Create a strong password"
          required
          icon={<Lock className="h-4 w-4" />}
        />
        
        <Button className="w-full" disabled={!formData.name || !formData.email || !formData.password}>
          Create Account
        </Button>
      </CardContent>
    </Card>
  )
}

// Example 2: Custom Implementation using Prop Getters
export function CustomInputExample() {
  const [value, setValue] = useState('')
  const [customError, setCustomError] = useState('')

  const {
    getInputProps,
    getLabelProps,
    getContainerProps,
    getErrorProps,
    state,
    hasError,
  } = useInputField({
    label: 'Custom Input',
    value,
    onChange: setValue,
    error: customError,
    validation: {
      minLength: 3,
      custom: (val) => {
        if (val.includes('test')) {
          return 'Cannot contain the word "test"'
        }
        return null
      }
    }
  })

  const handleCustomValidation = () => {
    if (value.length < 3) {
      setCustomError('Must be at least 3 characters')
    } else if (value.includes('test')) {
      setCustomError('Cannot contain the word "test"')
    } else {
      setCustomError('')
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Custom Implementation with Prop Getters</CardTitle>
        <CardDescription>
          Using prop getters for maximum flexibility and composition
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div {...getContainerProps()}>
          <label {...getLabelProps({ className: 'text-lg font-bold' })}>
            Custom Input Field
          </label>
          
          <div className="relative">
            <input 
              {...getInputProps({ 
                className: 'border-2 border-blue-300 focus:border-blue-500',
                placeholder: 'Type something...',
                'data-testid': 'custom-input'
              })} 
            />
          </div>
          
          {hasError && (
            <p {...getErrorProps({ className: 'text-red-600 font-semibold' })}>
              {state.error}
            </p>
          )}
        </div>
        
        <div className="flex gap-2">
          <Button onClick={handleCustomValidation} variant="outline">
            Validate
          </Button>
          <Button onClick={() => setValue('')} variant="ghost">
            Clear
          </Button>
        </div>
        
        <div className="text-sm text-gray-600">
          <p>Current value: "{value}"</p>
          <p>Has error: {hasError.toString()}</p>
          <p>Is touched: {state.isTouched.toString()}</p>
        </div>
      </CardContent>
    </Card>
  )
}

// Example 3: Event Handler Composition
export function EventCompositionExample() {
  const [value, setValue] = useState('')
  const [focusCount, setFocusCount] = useState(0)
  const [blurCount, setBlurCount] = useState(0)
  const [changeCount, setChangeCount] = useState(0)

  const {
    getInputProps,
    getLabelProps,
    getContainerProps,
  } = useInputField({
    label: 'Event Composition Demo',
    value,
    onChange: setValue,
    onFocus: () => setFocusCount(prev => prev + 1),
    onBlur: () => setBlurCount(prev => prev + 1),
  })

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChangeCount(prev => prev + 1)
    console.log('Custom change handler called')
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Event Handler Composition</CardTitle>
        <CardDescription>
          Demonstrating how prop getters compose event handlers
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div {...getContainerProps()}>
          <label {...getLabelProps()}>
            Event Composition Demo
          </label>
          
          <input 
            {...getInputProps({ 
              onChange: handleCustomChange,
              placeholder: 'Type to see event composition...'
            })} 
          />
        </div>
        
        <div className="grid grid-cols-3 gap-2 text-sm">
          <div className="text-center p-2 bg-blue-50 rounded">
            <div className="font-semibold">Focus</div>
            <div>{focusCount}</div>
          </div>
          <div className="text-center p-2 bg-green-50 rounded">
            <div className="font-semibold">Blur</div>
            <div>{blurCount}</div>
          </div>
          <div className="text-center p-2 bg-purple-50 rounded">
            <div className="font-semibold">Change</div>
            <div>{changeCount}</div>
          </div>
        </div>
        
        <Button onClick={() => {
          setFocusCount(0)
          setBlurCount(0)
          setChangeCount(0)
        }} variant="outline" className="w-full">
          Reset Counters
        </Button>
      </CardContent>
    </Card>
  )
}

// Example 4: Specialized Input Components
export function SpecializedInputsExample() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    website: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.email) newErrors.email = 'Email is required'
    if (!formData.password) newErrors.password = 'Password is required'
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    if (!formData.phone) newErrors.phone = 'Phone is required'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Specialized Input Components</CardTitle>
        <CardDescription>
          Using specialized components with built-in validation
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <EmailInput
          label="Email Address"
          value={formData.email}
          onChange={(value) => setFormData(prev => ({ ...prev, email: value }))}
          placeholder="your@email.com"
          required
          icon={<Mail className="h-4 w-4" />}
          error={errors.email}
        />
        
        <PasswordInput
          label="Password"
          value={formData.password}
          onChange={(value) => setFormData(prev => ({ ...prev, password: value }))}
          placeholder="Create a strong password"
          required
          icon={<Lock className="h-4 w-4" />}
          error={errors.password}
        />
        
        <PasswordInput
          label="Confirm Password"
          value={formData.confirmPassword}
          onChange={(value) => setFormData(prev => ({ ...prev, confirmPassword: value }))}
          placeholder="Confirm your password"
          required
          icon={<Lock className="h-4 w-4" />}
          error={errors.confirmPassword}
        />
        
        <PhoneInput
          label="Phone Number"
          value={formData.phone}
          onChange={(value) => setFormData(prev => ({ ...prev, phone: value }))}
          placeholder="+1 (555) 123-4567"
          required
          icon={<Phone className="h-4 w-4" />}
          error={errors.phone}
        />
        
        <InputFieldAdvanced
          label="Website"
          type="url"
          value={formData.website}
          onChange={(value) => setFormData(prev => ({ ...prev, website: value }))}
          placeholder="https://yourwebsite.com"
          icon={<MapPin className="h-4 w-4" />}
          validation={{
            pattern: /^https?:\/\/.+/,
            custom: (value) => {
              if (value && !/^https?:\/\/.+/.test(value)) {
                return 'Must be a valid URL starting with http:// or https://'
              }
              return null
            }
          }}
        />
        
        <Button 
          onClick={validateForm} 
          className="w-full"
          disabled={!formData.email || !formData.password || !formData.phone}
        >
          Validate Form
        </Button>
      </CardContent>
    </Card>
  )
}

// Example 5: Advanced Form with Mixed Patterns
export function AdvancedFormExample() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    address: '',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setSubmitMessage('')
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsSubmitting(false)
    setSubmitMessage('Form submitted successfully!')
  }

  const isFormValid = formData.firstName && formData.lastName && 
                     formData.email && formData.password && formData.phone

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>Advanced Form with Mixed Patterns</CardTitle>
        <CardDescription>
          Combining prop collections, getters, and specialized components
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <InputFieldAdvanced
            label="First Name"
            value={formData.firstName}
            onChange={(value) => setFormData(prev => ({ ...prev, firstName: value }))}
            placeholder="John"
            required
            icon={<User className="h-4 w-4" />}
          />
          
          <InputFieldAdvanced
            label="Last Name"
            value={formData.lastName}
            onChange={(value) => setFormData(prev => ({ ...prev, lastName: value }))}
            placeholder="Doe"
            required
            icon={<User className="h-4 w-4" />}
          />
        </div>
        
        <EmailInput
          label="Email Address"
          value={formData.email}
          onChange={(value) => setFormData(prev => ({ ...prev, email: value }))}
          placeholder="john.doe@example.com"
          required
          icon={<Mail className="h-4 w-4" />}
        />
        
        <PasswordInput
          label="Password"
          value={formData.password}
          onChange={(value) => setFormData(prev => ({ ...prev, password: value }))}
          placeholder="Create a secure password"
          required
          icon={<Lock className="h-4 w-4" />}
        />
        
        <PhoneInput
          label="Phone Number"
          value={formData.phone}
          onChange={(value) => setFormData(prev => ({ ...prev, phone: value }))}
          placeholder="+1 (555) 123-4567"
          required
          icon={<Phone className="h-4 w-4" />}
        />
        
        <InputFieldAdvanced
          label="Address"
          value={formData.address}
          onChange={(value) => setFormData(prev => ({ ...prev, address: value }))}
          placeholder="123 Main St, City, State 12345"
          icon={<MapPin className="h-4 w-4" />}
        />
        
        <Button 
          onClick={handleSubmit} 
          className="w-full"
          disabled={!isFormValid || isSubmitting}
        >
          {isSubmitting ? 'Creating Account...' : 'Create Account'}
        </Button>
        
        {submitMessage && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-md text-green-800 text-center">
            {submitMessage}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Main Examples Component
export function InputFieldExamples() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Prop Collections and Getters Examples
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Demonstrating advanced React patterns for building flexible, reusable input components
            with pre-configured prop objects and composable prop functions.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <BasicInputExample />
          <CustomInputExample />
          <EventCompositionExample />
          <SpecializedInputsExample />
          <div className="lg:col-span-2 flex justify-center">
            <AdvancedFormExample />
          </div>
        </div>
      </div>
    </div>
  )
}
