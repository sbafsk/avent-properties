/**
 * Tests for PropertyFilter Flexible Compound Components
 */

import { render, screen, fireEvent } from '@testing-library/react'
import { PropertyFilter, type FilterState, type FilterOptions } from '@/components/property-filter-compound'

// Mock data
const mockFilterOptions: FilterOptions = {
  locations: ['Punta del Este', 'José Ignacio'],
  propertyTypes: ['Villa', 'Apartment'],
  amenities: ['Ocean View', 'Private Pool'],
  priceRange: {
    min: 100000,
    max: 2000000,
    step: 50000,
  },
  bedroomOptions: [2, 3, 4],
  bathroomOptions: [2, 3],
}

describe('PropertyFilter Flexible Compound Components', () => {
  const mockOnFilterChange = jest.fn()
  const mockOnClose = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Default Composition', () => {
    it('renders all components in default layout', () => {
      render(
        <PropertyFilter
          onFilterChange={mockOnFilterChange}
          onClose={mockOnClose}
        >
          <PropertyFilter.Sidebar>
            <PropertyFilter.Header />
            <PropertyFilter.Content>
              <PropertyFilter.Search />
              <PropertyFilter.PriceRange />
              <PropertyFilter.CheckboxGroup
                label="Location"
                filterKey="location"
              />
              <PropertyFilter.CheckboxGroup
                label="Property Type"
                filterKey="propertyType"
              />
              <PropertyFilter.ButtonGroup
                label="Bedrooms"
                filterKey="bedrooms"
              />
              <PropertyFilter.ButtonGroup
                label="Bathrooms"
                filterKey="bathrooms"
              />
              <PropertyFilter.CheckboxGroup
                label="Amenities"
                filterKey="amenities"
              />
            </PropertyFilter.Content>
          </PropertyFilter.Sidebar>
        </PropertyFilter>
      )

      // Check that all elements are rendered
      expect(screen.getByText('Filters')).toBeInTheDocument()
      expect(screen.getByText('Search')).toBeInTheDocument()
      expect(screen.getByText('Price Range')).toBeInTheDocument()
      expect(screen.getByText('Location')).toBeInTheDocument()
      expect(screen.getByText('Property Type')).toBeInTheDocument()
      expect(screen.getByText('Bedrooms')).toBeInTheDocument()
      expect(screen.getByText('Bathrooms')).toBeInTheDocument()
      expect(screen.getByText('Amenities')).toBeInTheDocument()
    })

    it('calls onFilterChange when filters are updated', () => {
      render(
        <PropertyFilter
          onFilterChange={mockOnFilterChange}
          onClose={mockOnClose}
        >
          <PropertyFilter.Sidebar>
            <PropertyFilter.Header />
            <PropertyFilter.Content>
              <PropertyFilter.CheckboxGroup
                label="Location"
                filterKey="location"
              />
            </PropertyFilter.Content>
          </PropertyFilter.Sidebar>
        </PropertyFilter>
      )

      // Click on a location checkbox
      const locationCheckbox = screen.getByLabelText('Punta del Este')
      fireEvent.click(locationCheckbox)

      expect(mockOnFilterChange).toHaveBeenCalledWith(
        expect.objectContaining({
          location: ['Punta del Este'],
        })
      )
    })

    it('calls onClose when close button is clicked', () => {
      render(
        <PropertyFilter
          onFilterChange={mockOnFilterChange}
          onClose={mockOnClose}
        >
          <PropertyFilter.Sidebar>
            <PropertyFilter.Header />
            <PropertyFilter.Content>
              <PropertyFilter.Search />
            </PropertyFilter.Content>
          </PropertyFilter.Sidebar>
        </PropertyFilter>
      )

      const closeButton = screen.getByRole('button', { name: 'Close filters' })
      fireEvent.click(closeButton)

      expect(mockOnClose).toHaveBeenCalled()
    })
  })

  describe('Custom Compositions', () => {
    it('renders minimal filter with only essential components', () => {
      render(
        <PropertyFilter onFilterChange={mockOnFilterChange}>
          <PropertyFilter.Sidebar>
            <PropertyFilter.Header showClearButton={false} />
            <PropertyFilter.Content>
              <PropertyFilter.PriceRange />
              <PropertyFilter.ButtonGroup
                label="Bedrooms"
                filterKey="bedrooms"
              />
            </PropertyFilter.Content>
          </PropertyFilter.Sidebar>
        </PropertyFilter>
      )

      // Should have price range and bedrooms
      expect(screen.getByText('Price Range')).toBeInTheDocument()
      expect(screen.getByText('Bedrooms')).toBeInTheDocument()
      
      // Should not have other elements
      expect(screen.queryByText('Search')).not.toBeInTheDocument()
      expect(screen.queryByText('Location')).not.toBeInTheDocument()
    })

    it('renders custom filter with different order', () => {
      render(
        <PropertyFilter
          onFilterChange={mockOnFilterChange}
          options={mockFilterOptions}
        >
          <PropertyFilter.Sidebar>
            <PropertyFilter.Header title="Custom Filters" />
            <PropertyFilter.Content>
              <PropertyFilter.CheckboxGroup
                label="Property Type"
                filterKey="propertyType"
              />
              <PropertyFilter.PriceRange />
              <PropertyFilter.ButtonGroup
                label="Bedrooms"
                filterKey="bedrooms"
              />
            </PropertyFilter.Content>
          </PropertyFilter.Sidebar>
        </PropertyFilter>
      )

      // Check custom title
      expect(screen.getByText('Custom Filters')).toBeInTheDocument()
      
      // Check order (Property Type should come before Price Range)
      const content = screen.getByText('Property Type').closest('.space-y-6')
      const sections = content?.querySelectorAll('.space-y-3')
      
      // Find the indices of Property Type and Price Range sections
      let propertyTypeIndex = -1
      let priceRangeIndex = -1
      
      sections?.forEach((section, index) => {
        if (section.textContent?.includes('Property Type')) {
          propertyTypeIndex = index
        }
        if (section.textContent?.includes('Price Range')) {
          priceRangeIndex = index
        }
      })
      
      expect(propertyTypeIndex).toBeGreaterThan(-1)
      expect(priceRangeIndex).toBeGreaterThan(-1)
      expect(propertyTypeIndex).toBeLessThan(priceRangeIndex)
    })
  })

  describe('Individual Components', () => {
    it('renders PropertyFilter.Search correctly', () => {
      render(
        <PropertyFilter onFilterChange={mockOnFilterChange}>
          <PropertyFilter.Sidebar>
            <PropertyFilter.Content>
              <PropertyFilter.Search placeholder="Custom search..." />
            </PropertyFilter.Content>
          </PropertyFilter.Sidebar>
        </PropertyFilter>
      )

      const searchInput = screen.getByPlaceholderText('Custom search...')
      expect(searchInput).toBeInTheDocument()
    })

    it('renders PropertyFilter.PriceRange correctly', () => {
      render(
        <PropertyFilter
          onFilterChange={mockOnFilterChange}
          options={mockFilterOptions}
        >
          <PropertyFilter.Sidebar>
            <PropertyFilter.Content>
              <PropertyFilter.PriceRange />
            </PropertyFilter.Content>
          </PropertyFilter.Sidebar>
        </PropertyFilter>
      )

      expect(screen.getByText('Price Range')).toBeInTheDocument()
      expect(screen.getByText('$100,000')).toBeInTheDocument()
      expect(screen.getByText('$2,000,000')).toBeInTheDocument()
    })

    it('renders PropertyFilter.CheckboxGroup correctly', () => {
      render(
        <PropertyFilter
          onFilterChange={mockOnFilterChange}
          options={mockFilterOptions}
        >
          <PropertyFilter.Sidebar>
            <PropertyFilter.Content>
              <PropertyFilter.CheckboxGroup
                label="Location"
                filterKey="location"
              />
            </PropertyFilter.Content>
          </PropertyFilter.Sidebar>
        </PropertyFilter>
      )

      expect(screen.getByText('Location')).toBeInTheDocument()
      expect(screen.getByLabelText('Punta del Este')).toBeInTheDocument()
      expect(screen.getByLabelText('José Ignacio')).toBeInTheDocument()
    })

    it('renders PropertyFilter.ButtonGroup correctly', () => {
      render(
        <PropertyFilter
          onFilterChange={mockOnFilterChange}
          options={mockFilterOptions}
        >
          <PropertyFilter.Sidebar>
            <PropertyFilter.Content>
              <PropertyFilter.ButtonGroup
                label="Bedrooms"
                filterKey="bedrooms"
              />
            </PropertyFilter.Content>
          </PropertyFilter.Sidebar>
        </PropertyFilter>
      )

      expect(screen.getByText('Bedrooms')).toBeInTheDocument()
      expect(screen.getByText('2+')).toBeInTheDocument()
      expect(screen.getByText('3+')).toBeInTheDocument()
      expect(screen.getByText('4+')).toBeInTheDocument()
    })
  })

  describe('Context Usage', () => {
    it('throws error when compound components are used outside PropertyFilter', () => {
      // Suppress console.error for this test
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
      
      expect(() => {
        render(<PropertyFilter.Search />)
      }).toThrow('PropertyFilter compound components must be used within PropertyFilter')
      
      consoleSpy.mockRestore()
    })
  })

  describe('Filter State Management', () => {
    it('updates filter state when checkboxes are clicked', () => {
      render(
        <PropertyFilter
          onFilterChange={mockOnFilterChange}
          options={mockFilterOptions}
        >
          <PropertyFilter.Sidebar>
            <PropertyFilter.Content>
              <PropertyFilter.CheckboxGroup
                label="Location"
                filterKey="location"
              />
            </PropertyFilter.Content>
          </PropertyFilter.Sidebar>
        </PropertyFilter>
      )

      // Click first location
      fireEvent.click(screen.getByLabelText('Punta del Este'))
      expect(mockOnFilterChange).toHaveBeenCalledWith(
        expect.objectContaining({
          location: ['Punta del Este'],
        })
      )

      // Click second location
      fireEvent.click(screen.getByLabelText('José Ignacio'))
      expect(mockOnFilterChange).toHaveBeenCalledWith(
        expect.objectContaining({
          location: ['Punta del Este', 'José Ignacio'],
        })
      )

      // Unclick first location
      fireEvent.click(screen.getByLabelText('Punta del Este'))
      expect(mockOnFilterChange).toHaveBeenCalledWith(
        expect.objectContaining({
          location: ['José Ignacio'],
        })
      )
    })

    it('updates filter state when buttons are clicked', () => {
      render(
        <PropertyFilter
          onFilterChange={mockOnFilterChange}
          options={mockFilterOptions}
        >
          <PropertyFilter.Sidebar>
            <PropertyFilter.Content>
              <PropertyFilter.ButtonGroup
                label="Bedrooms"
                filterKey="bedrooms"
              />
            </PropertyFilter.Content>
          </PropertyFilter.Sidebar>
        </PropertyFilter>
      )

      // Click bedroom button
      fireEvent.click(screen.getByText('2+'))
      expect(mockOnFilterChange).toHaveBeenCalledWith(
        expect.objectContaining({
          bedrooms: [2],
        })
      )

      // Click another bedroom button
      fireEvent.click(screen.getByText('3+'))
      expect(mockOnFilterChange).toHaveBeenCalledWith(
        expect.objectContaining({
          bedrooms: [2, 3],
        })
      )
    })

    it('clears all filters when clear button is clicked', () => {
      render(
        <PropertyFilter
          onFilterChange={mockOnFilterChange}
          options={mockFilterOptions}
        >
          <PropertyFilter.Sidebar>
            <PropertyFilter.Header />
            <PropertyFilter.Content>
              <PropertyFilter.CheckboxGroup
                label="Location"
                filterKey="location"
              />
            </PropertyFilter.Content>
          </PropertyFilter.Sidebar>
        </PropertyFilter>
      )

      // First, select a location
      fireEvent.click(screen.getByLabelText('Punta del Este'))
      
      // Then clear all filters
      fireEvent.click(screen.getByText('Clear All'))
      
      expect(mockOnFilterChange).toHaveBeenCalledWith(
        expect.objectContaining({
          location: [],
          propertyType: [],
          amenities: [],
          bedrooms: [],
          bathrooms: [],
        })
      )
    })
  })

  describe('Toggle Functionality', () => {
    it('renders toggle button and toggles sidebar visibility', () => {
      render(
        <PropertyFilter onFilterChange={mockOnFilterChange}>
          <PropertyFilter.Toggle>Filter Properties</PropertyFilter.Toggle>
          <PropertyFilter.Sidebar>
            <PropertyFilter.Header />
            <PropertyFilter.Content>
              <PropertyFilter.Search />
            </PropertyFilter.Content>
          </PropertyFilter.Sidebar>
        </PropertyFilter>
      )

      const toggleButton = screen.getByText('Filter Properties')
      expect(toggleButton).toBeInTheDocument()

      // Initially sidebar should be hidden (isOpen defaults to false)
      const sidebar = screen.getByText('Search').closest('.fixed')
      expect(sidebar).toHaveClass('-translate-x-full')

      // Click toggle to open
      fireEvent.click(toggleButton)
      expect(sidebar).toHaveClass('translate-x-0')
    })
  })

  describe('Custom Options', () => {
    it('uses custom filter options when provided', () => {
      render(
        <PropertyFilter
          onFilterChange={mockOnFilterChange}
          options={mockFilterOptions}
        >
          <PropertyFilter.Sidebar>
            <PropertyFilter.Content>
              <PropertyFilter.CheckboxGroup
                label="Location"
                filterKey="location"
              />
              <PropertyFilter.ButtonGroup
                label="Bedrooms"
                filterKey="bedrooms"
              />
            </PropertyFilter.Content>
          </PropertyFilter.Sidebar>
        </PropertyFilter>
      )

      // Should only show custom locations
      expect(screen.getByLabelText('Punta del Este')).toBeInTheDocument()
      expect(screen.getByLabelText('José Ignacio')).toBeInTheDocument()
      expect(screen.queryByLabelText('Piriápolis')).not.toBeInTheDocument()

      // Should only show custom bedroom options
      expect(screen.getByText('2+')).toBeInTheDocument()
      expect(screen.getByText('3+')).toBeInTheDocument()
      expect(screen.getByText('4+')).toBeInTheDocument()
      expect(screen.queryByText('1+')).not.toBeInTheDocument()
    })
  })
})
