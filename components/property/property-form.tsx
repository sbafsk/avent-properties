import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { InputField } from '@/components/ui/input-field'
import { SelectField } from '@/components/ui/select-field'

// Validation schema
const propertySchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  price: z.number().positive("Price must be positive"),
  location: z.enum(['punta-del-este', 'jose-ignacio', 'piriapolis']),
  propertyType: z.enum(['apartment', 'house', 'villa', 'land']),
  bedrooms: z.number().int().min(0),
  bathrooms: z.number().int().min(0),
  areaM2: z.number().positive("Area must be positive")
})

type PropertyFormData = z.infer<typeof propertySchema>

// Mock data for select options
const locationOptions = [
  { value: 'punta-del-este', label: 'Punta del Este' },
  { value: 'jose-ignacio', label: 'José Ignacio' },
  { value: 'piriapolis', label: 'Piriápolis' }
]

const propertyTypeOptions = [
  { value: 'apartment', label: 'Apartment' },
  { value: 'house', label: 'House' },
  { value: 'villa', label: 'Villa' },
  { value: 'land', label: 'Land' }
]

interface PropertyFormProps {
  onSubmit: (data: PropertyFormData) => void
  initialData?: Partial<PropertyFormData>
  isLoading?: boolean
}

export function PropertyForm({ onSubmit, initialData, isLoading = false }: PropertyFormProps) {
  const form = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      price: initialData?.price || 0,
      location: initialData?.location || 'punta-del-este',
      propertyType: initialData?.propertyType || 'apartment',
      bedrooms: initialData?.bedrooms || 0,
      bathrooms: initialData?.bathrooms || 0,
      areaM2: initialData?.areaM2 || 0
    },
    mode: 'onBlur'
  })

  const handleSubmit = (data: PropertyFormData) => {
    onSubmit(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Property Title</FormLabel>
                <FormControl>
                  <InputField
                    label="Property Title"
                    name="title"
                    required
                    placeholder="Enter property title"
                    value={field.value}
                    onChange={field.onChange}
                    error={form.formState.errors.title?.message}
                    description="A descriptive title for your property listing"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <InputField
                    label="Price"
                    name="price"
                    type="number"
                    required
                    placeholder="0"
                    value={field.value.toString()}
                    onChange={(value) => field.onChange(parseFloat(value) || 0)}
                    error={form.formState.errors.price?.message}
                    description="Property price in USD"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                                  <InputField
                    label="Description"
                    name="description"
                    required
                    placeholder="Describe your property..."
                    value={field.value}
                    onChange={field.onChange}
                    error={form.formState.errors.description?.message}
                    description="Detailed description of your property"
                  />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <SelectField
                    label="Location"
                    name="location"
                    options={locationOptions}
                    value={locationOptions.find(opt => opt.value === field.value)}
                    onChange={(option) => field.onChange(option.value)}
                    getOptionLabel={(option) => option.label}
                    getOptionValue={(option) => option.value}
                    required
                    error={form.formState.errors.location?.message}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="propertyType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Property Type</FormLabel>
                <FormControl>
                  <SelectField
                    label="Property Type"
                    name="propertyType"
                    options={propertyTypeOptions}
                    value={propertyTypeOptions.find(opt => opt.value === field.value)}
                    onChange={(option) => field.onChange(option.value)}
                    getOptionLabel={(option) => option.label}
                    getOptionValue={(option) => option.value}
                    required
                    error={form.formState.errors.propertyType?.message}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField
            control={form.control}
            name="bedrooms"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bedrooms</FormLabel>
                <FormControl>
                  <InputField
                    label="Bedrooms"
                    name="bedrooms"
                    type="number"
                    required
                    placeholder="0"
                    value={field.value.toString()}
                    onChange={(value) => field.onChange(parseInt(value) || 0)}
                    error={form.formState.errors.bedrooms?.message}
                    description="Number of bedrooms"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bathrooms"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bathrooms</FormLabel>
                <FormControl>
                  <InputField
                    label="Bathrooms"
                    name="bathrooms"
                    type="number"
                    required
                    placeholder="0"
                    value={field.value.toString()}
                    onChange={(value) => field.onChange(parseInt(value) || 0)}
                    error={form.formState.errors.bathrooms?.message}
                    description="Number of bathrooms"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="areaM2"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Area (m²)</FormLabel>
                <FormControl>
                  <InputField
                    label="Area (m²)"
                    name="areaM2"
                    type="text"
                    required
                    placeholder="0"
                    value={field.value.toString()}
                    onChange={(value) => field.onChange(parseFloat(value) || 0)}
                    error={form.formState.errors.areaM2?.message}
                    description="Property area in square meters"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Creating...' : 'Create Property'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
