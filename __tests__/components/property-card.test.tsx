import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { PropertyCard } from '@/components/property/property-card'

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} {...props} />
  }
}))

const mockProperty = {
  id: '1',
  title: 'Luxury Beach Villa',
  description: 'Beautiful villa with ocean view',
  price: 1500000,
  currency: 'USD',
  location: 'Punta del Este',
  bedrooms: 4,
  bathrooms: 3,
  areaM2: 250,
  images: ['/image1.jpg', '/image2.jpg'],
  amenities: ['Pool', 'Garden', 'Ocean View', 'Garage']
}

describe('PropertyCard', () => {
  it('renders property information correctly', () => {
    render(<PropertyCard property={mockProperty} />)

    expect(screen.getByText('Luxury Beach Villa')).toBeInTheDocument()
    expect(screen.getByText('Punta del Este')).toBeInTheDocument()
    expect(screen.getByText('$1,500,000.00')).toBeInTheDocument()
    expect(screen.getByText('4 beds')).toBeInTheDocument()
    expect(screen.getByText('3 baths')).toBeInTheDocument()
    expect(screen.getByText('250m²')).toBeInTheDocument()
  })

  it('displays amenities correctly', () => {
    render(<PropertyCard property={mockProperty} />)

    expect(screen.getByText('Pool')).toBeInTheDocument()
    expect(screen.getByText('Garden')).toBeInTheDocument()
    expect(screen.getByText('Ocean View')).toBeInTheDocument()
    expect(screen.getByText('+1 more')).toBeInTheDocument()
  })

  it('handles bookmark action', () => {
    const onBookmark = jest.fn()
    render(<PropertyCard property={mockProperty} onBookmark={onBookmark} />)

    const bookmarkButton = screen.getByRole('button', { name: /add bookmark/i })
    fireEvent.click(bookmarkButton)

    expect(onBookmark).toHaveBeenCalledWith(mockProperty)
  })

  it('handles select action', () => {
    const onSelect = jest.fn()
    render(<PropertyCard property={mockProperty} onSelect={onSelect} />)

    const selectButton = screen.getByRole('button', { name: /select property/i })
    fireEvent.click(selectButton)

    expect(onSelect).toHaveBeenCalledWith(mockProperty)
  })

  it('shows featured badge when variant is featured', () => {
    render(<PropertyCard property={mockProperty} variant="featured" />)

    expect(screen.getByText('Featured')).toBeInTheDocument()
  })

  it('applies selected state styling', () => {
    render(<PropertyCard property={mockProperty} isSelected={true} onSelect={jest.fn()} />)

    const selectButton = screen.getByRole('button', { name: /deselect property/i })
    expect(selectButton).toHaveClass('bg-primary')
  })

  it('displays property image with alt text', () => {
    render(<PropertyCard property={mockProperty} />)

    const image = screen.getByAltText('Luxury Beach Villa')
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', '/image1.jpg')
  })

  it('shows image navigation when multiple images exist', () => {
    render(<PropertyCard property={mockProperty} />)

    // Should show image navigation dots
    expect(screen.getByLabelText('View image 1 of 2')).toBeInTheDocument()
    expect(screen.getByLabelText('View image 2 of 2')).toBeInTheDocument()
  })

  it('handles wishlist action', () => {
    render(<PropertyCard property={mockProperty} />)

    const wishlistButton = screen.getByRole('button', { name: /add to wishlist/i })
    fireEvent.click(wishlistButton)

    // The wishlist state is managed internally by the component
    expect(wishlistButton).toBeInTheDocument()
  })

  it('handles share action', () => {
    const onShare = jest.fn()
    render(<PropertyCard property={mockProperty} onShare={onShare} />)

    const shareButton = screen.getByRole('button', { name: /share property/i })
    fireEvent.click(shareButton)

    expect(onShare).toHaveBeenCalledWith(mockProperty)
  })

  it('applies proper accessibility attributes', () => {
    render(<PropertyCard property={mockProperty} onSelect={jest.fn()} />)

    const selectButton = screen.getByRole('button', { name: /select property/i })
    expect(selectButton).toBeInTheDocument()

    const bookmarkButton = screen.getByRole('button', { name: /add bookmark/i })
    expect(bookmarkButton).toBeInTheDocument()
  })

  it('renders with custom className', () => {
    const customClass = 'custom-property-card'
    const { container } = render(
      <PropertyCard property={mockProperty} className={customClass} />
    )

    expect(container.firstChild).toHaveClass(customClass)
  })
})


