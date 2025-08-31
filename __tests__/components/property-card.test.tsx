import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { PropertyCard } from "@/components/property-card";

// Mock the useFavorites hook
jest.mock("@/hooks/use-favorites", () => ({
  useFavorites: () => ({
    isFavorite: jest.fn(() => false),
    toggleFavorite: jest.fn(),
  }),
}));

// Mock Next.js Image component
jest.mock("next/image", () => {
  return function MockImage({ src, alt, ...props }: any) {
    return <img src={src} alt={alt} {...props} />;
  };
});

const mockProperty = {
  id: "1",
  title: "Luxury Beach House",
  city: "Punta del Este",
  neighborhood: "La Barra",
  price: 1500000,
  currency: "USD",
  bedrooms: 4,
  bathrooms: 3,
  area_m2: 250,
  imageUrl: "/test-image.jpg",
  property_type: "House",
  featured: false,
};

describe("PropertyCard", () => {
  it("renders property information correctly", () => {
    render(<PropertyCard {...mockProperty} />);
    
    expect(screen.getByText("Luxury Beach House")).toBeInTheDocument();
    expect(screen.getByText("Punta del Este, La Barra")).toBeInTheDocument();
    expect(screen.getByText("$1,500,000")).toBeInTheDocument();
    expect(screen.getByText("House")).toBeInTheDocument();
  });

  it("renders property specifications", () => {
    render(<PropertyCard {...mockProperty} />);
    
    expect(screen.getByText("4")).toBeInTheDocument(); // bedrooms
    expect(screen.getByText("3")).toBeInTheDocument(); // bathrooms
    expect(screen.getByText("250m²")).toBeInTheDocument(); // area
  });

  it("shows featured badge when property is featured", () => {
    render(<PropertyCard {...mockProperty} featured />);
    
    expect(screen.getByText("Featured")).toBeInTheDocument();
  });

  it("does not show featured badge when property is not featured", () => {
    render(<PropertyCard {...mockProperty} featured={false} />);
    
    expect(screen.queryByText("Featured")).not.toBeInTheDocument();
  });

  it("calls onViewDetails when view details button is clicked", () => {
    const mockOnViewDetails = jest.fn();
    render(<PropertyCard {...mockProperty} onViewDetails={mockOnViewDetails} />);
    
    fireEvent.click(screen.getByText("View Details"));
    expect(mockOnViewDetails).toHaveBeenCalledWith("1");
  });

  it("calls onScheduleTour when schedule tour button is clicked", () => {
    const mockOnScheduleTour = jest.fn();
    render(<PropertyCard {...mockProperty} onScheduleTour={mockOnScheduleTour} />);
    
    fireEvent.click(screen.getByText("Schedule Tour"));
    expect(mockOnScheduleTour).toHaveBeenCalledWith("1");
  });

  it("renders heart icon for favorites", () => {
    render(<PropertyCard {...mockProperty} />);
    
    // The heart icon should be present (it's a button with Heart icon)
    const heartButton = screen.getByRole("button", { name: "" }); // Heart button doesn't have accessible name
    expect(heartButton).toBeInTheDocument();
  });

  it("handles missing optional properties gracefully", () => {
    const propertyWithoutOptionals = {
      ...mockProperty,
      bedrooms: undefined,
      bathrooms: undefined,
      area_m2: undefined,
      neighborhood: undefined,
    };
    
    render(<PropertyCard {...propertyWithoutOptionals} />);
    
    expect(screen.getByText("Luxury Beach House")).toBeInTheDocument();
    expect(screen.getByText("Punta del Este")).toBeInTheDocument(); // No neighborhood
    expect(screen.getByText("$1,500,000")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <PropertyCard {...mockProperty} className="custom-class" />
    );
    
    const card = container.querySelector(".custom-class");
    expect(card).toBeInTheDocument();
  });
});
