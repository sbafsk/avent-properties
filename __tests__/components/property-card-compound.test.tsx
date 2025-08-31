/**
 * Tests for PropertyCard Compound Components
 */

import { render, screen, fireEvent } from '@testing-library/react'
import { PropertyCard, type PropertyData } from '@/components/property-card-compound'

// Mock the useFavorites hook
jest.mock('@/hooks/use-favorites', () => ({
  useFavorites: () => ({
    isFavorite: jest.fn((id: string) => id === '1'),
    toggleFavorite: jest.fn(),
  }),
}))

const mockProperty: PropertyData = {
  id: '1',
  title: 'Luxury Beach House',
  city: 'Punta del Este',
  neighborhood: 'La Barra',
  price: 1500000,
  currency: 'USD',
  bedrooms: 4,
  bathrooms: 3,
  area_m2: 250,
  imageUrl: '/test-image.jpg',
  featured: true,
  property_type: 'Villa',
}

describe('PropertyCard Compound Components', () => {
  const mockOnViewDetails = jest.fn()
  const mockOnScheduleTour = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Default Composition', () => {
    it('renders all components in default layout', () => {
      render(
        <PropertyCard
          property={mockProperty}
          onViewDetails={mockOnViewDetails}
          onScheduleTour={mockOnScheduleTour}
        >
          <PropertyCard.ImageContainer>
            <PropertyCard.Image />
            <PropertyCard.Badges />
            <PropertyCard.Favorite />
          </PropertyCard.ImageContainer>
          
          <PropertyCard.Content>
            <PropertyCard.Header />
            <PropertyCard.Specs />
            <PropertyCard.Price />
            <PropertyCard.Actions />
          </PropertyCard.Content>
        </PropertyCard>
      )

      // Check that all elements are rendered
      expect(screen.getByText('Luxury Beach House')).toBeInTheDocument()
      expect(screen.getByText('Punta del Este, La Barra')).toBeInTheDocument()
      expect(screen.getByText('$1,500,000')).toBeInTheDocument()
      expect(screen.getByText('Featured')).toBeInTheDocument()
      expect(screen.getByText('Villa')).toBeInTheDocument()
      expect(screen.getByText('View Details')).toBeInTheDocument()
      expect(screen.getByText('Schedule Tour')).toBeInTheDocument()
    })

    it('calls onViewDetails when view details button is clicked', () => {
      render(
        <PropertyCard
          property={mockProperty}
          onViewDetails={mockOnViewDetails}
          onScheduleTour={mockOnScheduleTour}
        >
          <PropertyCard.ImageContainer>
            <PropertyCard.Image />
            <PropertyCard.Badges />
            <PropertyCard.Favorite />
          </PropertyCard.ImageContainer>
          
          <PropertyCard.Content>
            <PropertyCard.Header />
            <PropertyCard.Specs />
            <PropertyCard.Price />
            <PropertyCard.Actions />
          </PropertyCard.Content>
        </PropertyCard>
      )

      fireEvent.click(screen.getByText('View Details'))
      expect(mockOnViewDetails).toHaveBeenCalledWith('1')
    })

    it('calls onScheduleTour when schedule tour button is clicked', () => {
      render(
        <PropertyCard
          property={mockProperty}
          onViewDetails={mockOnViewDetails}
          onScheduleTour={mockOnScheduleTour}
        >
          <PropertyCard.ImageContainer>
            <PropertyCard.Image />
            <PropertyCard.Badges />
            <PropertyCard.Favorite />
          </PropertyCard.ImageContainer>
          
          <PropertyCard.Content>
            <PropertyCard.Header />
            <PropertyCard.Specs />
            <PropertyCard.Price />
            <PropertyCard.Actions />
          </PropertyCard.Content>
        </PropertyCard>
      )

      fireEvent.click(screen.getByText('Schedule Tour'))
      expect(mockOnScheduleTour).toHaveBeenCalledWith('1')
    })
  })

  describe('Custom Compositions', () => {
    it('renders minimal card with only image and price', () => {
      render(
        <PropertyCard property={mockProperty}>
          <PropertyCard.ImageContainer>
            <PropertyCard.Image />
            <PropertyCard.Favorite />
          </PropertyCard.ImageContainer>
          
          <PropertyCard.Content>
            <PropertyCard.Price />
          </PropertyCard.Content>
        </PropertyCard>
      )

      // Should have price
      expect(screen.getByText('$1,500,000')).toBeInTheDocument()
      
      // Should not have other elements
      expect(screen.queryByText('Luxury Beach House')).not.toBeInTheDocument()
      expect(screen.queryByText('View Details')).not.toBeInTheDocument()
    })

    it('renders image only with custom overlay', () => {
      render(
        <PropertyCard property={mockProperty}>
          <PropertyCard.ImageContainer>
            <PropertyCard.Image />
            <PropertyCard.Favorite />
            <div className="absolute bottom-4 left-4 right-4">
              <div className="bg-black/50 backdrop-blur-sm rounded-lg p-3">
                <h3 className="text-white font-semibold">Custom Title</h3>
              </div>
            </div>
          </PropertyCard.ImageContainer>
        </PropertyCard>
      )

      // Should have custom overlay
      expect(screen.getByText('Custom Title')).toBeInTheDocument()
      
      // Should not have default content
      expect(screen.queryByText('Luxury Beach House')).not.toBeInTheDocument()
    })
  })

  describe('Individual Components', () => {
    it('renders PropertyCard.Header correctly', () => {
      render(
        <PropertyCard property={mockProperty}>
          <PropertyCard.Content>
            <PropertyCard.Header />
          </PropertyCard.Content>
        </PropertyCard>
      )

      expect(screen.getByText('Luxury Beach House')).toBeInTheDocument()
      expect(screen.getByText('Punta del Este, La Barra')).toBeInTheDocument()
    })

    it('renders PropertyCard.Specs correctly', () => {
      render(
        <PropertyCard property={mockProperty}>
          <PropertyCard.Content>
            <PropertyCard.Specs />
          </PropertyCard.Content>
        </PropertyCard>
      )

      expect(screen.getByText('4')).toBeInTheDocument() // bedrooms
      expect(screen.getByText('3')).toBeInTheDocument() // bathrooms
      expect(screen.getByText('250m²')).toBeInTheDocument() // area
    })

    it('renders PropertyCard.Price correctly', () => {
      render(
        <PropertyCard property={mockProperty}>
          <PropertyCard.Content>
            <PropertyCard.Price />
          </PropertyCard.Content>
        </PropertyCard>
      )

      expect(screen.getByText('$1,500,000')).toBeInTheDocument()
    })

    it('renders PropertyCard.Badges correctly', () => {
      render(
        <PropertyCard property={mockProperty}>
          <PropertyCard.ImageContainer>
            <PropertyCard.Badges />
          </PropertyCard.ImageContainer>
        </PropertyCard>
      )

      expect(screen.getByText('Featured')).toBeInTheDocument()
      expect(screen.getByText('Villa')).toBeInTheDocument()
    })
  })

  describe('Context Usage', () => {
    it('throws error when compound components are used outside PropertyCard', () => {
      // Suppress console.error for this test
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
      
      expect(() => {
        render(<PropertyCard.Header />)
      }).toThrow('PropertyCard compound components must be used within PropertyCard')
      
      consoleSpy.mockRestore()
    })
  })

  describe('Accessibility', () => {
    it('has proper aria-label for favorite button', () => {
      render(
        <PropertyCard property={mockProperty}>
          <PropertyCard.ImageContainer>
            <PropertyCard.Favorite />
          </PropertyCard.ImageContainer>
        </PropertyCard>
      )

      // The mock returns that property id '1' is a favorite, so it should show "Remove from favorites"
      const favoriteButton = screen.getByRole('button', { name: 'Remove from favorites' })
      expect(favoriteButton).toBeInTheDocument()
    })
  })
})
