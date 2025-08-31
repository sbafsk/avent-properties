import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { PropertyCard } from "@/components/property-card";
import { FavoritesProvider } from "@/hooks/favorites-context";

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

// Helper function to render with FavoritesProvider
const renderWithProvider = async (component: React.ReactElement) => {
  let result: any;
  await act(async () => {
    result = render(
      <FavoritesProvider>
        {component}
      </FavoritesProvider>
    );
  });
  return result;
};

describe("PropertyCard", () => {
  it("renders property information correctly", async () => {
    await renderWithProvider(<PropertyCard {...mockProperty} />);
    
    expect(screen.getByText("Luxury Beach House")).toBeInTheDocument();
    expect(screen.getByText("Punta del Este, La Barra")).toBeInTheDocument();
    expect(screen.getByText("$1,500,000")).toBeInTheDocument();
    expect(screen.getByText("House")).toBeInTheDocument();
  });

  it("renders property specifications", async () => {
    await renderWithProvider(<PropertyCard {...mockProperty} />);
    
    expect(screen.getByText("4")).toBeInTheDocument(); // bedrooms
    expect(screen.getByText("3")).toBeInTheDocument(); // bathrooms
    expect(screen.getByText("250m²")).toBeInTheDocument(); // area
  });

  it("shows featured badge when property is featured", async () => {
    await renderWithProvider(<PropertyCard {...mockProperty} featured />);
    
    expect(screen.getByText("Featured")).toBeInTheDocument();
  });

  it("does not show featured badge when property is not featured", async () => {
    await renderWithProvider(<PropertyCard {...mockProperty} featured={false} />);
    
    expect(screen.queryByText("Featured")).not.toBeInTheDocument();
  });

  it("calls onViewDetails when view details button is clicked", async () => {
    const mockOnViewDetails = jest.fn();
    await renderWithProvider(<PropertyCard {...mockProperty} onViewDetails={mockOnViewDetails} />);
    
    fireEvent.click(screen.getByText("View Details"));
    expect(mockOnViewDetails).toHaveBeenCalledWith("1");
  });

  it("calls onScheduleTour when schedule tour button is clicked", async () => {
    const mockOnScheduleTour = jest.fn();
    await renderWithProvider(<PropertyCard {...mockProperty} onScheduleTour={mockOnScheduleTour} />);
    
    fireEvent.click(screen.getByText("Schedule Tour"));
    expect(mockOnScheduleTour).toHaveBeenCalledWith("1");
  });

  it("renders heart icon for favorites", async () => {
    await renderWithProvider(<PropertyCard {...mockProperty} />);
    
    // The heart icon should be present (it's a button with Heart icon)
    const heartButton = screen.getByRole("button", { name: "Add to favorites" });
    expect(heartButton).toBeInTheDocument();
  });

  it("handles missing optional properties gracefully", async () => {
    const propertyWithoutOptionals = {
      ...mockProperty,
      bedrooms: undefined,
      bathrooms: undefined,
      area_m2: undefined,
      neighborhood: undefined,
    };
    
    await renderWithProvider(<PropertyCard {...propertyWithoutOptionals} />);
    
    expect(screen.getByText("Luxury Beach House")).toBeInTheDocument();
    expect(screen.getByText("Punta del Este")).toBeInTheDocument(); // No neighborhood
    expect(screen.getByText("$1,500,000")).toBeInTheDocument();
  });

  it("applies custom className", async () => {
    const { container } = await renderWithProvider(
      <PropertyCard {...mockProperty} className="custom-class" />
    );
    
    const card = container.querySelector(".custom-class");
    expect(card).toBeInTheDocument();
  });
});


