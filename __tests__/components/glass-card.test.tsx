import React from "react";
import { render, screen } from "@testing-library/react";
import { GlassCard } from "@/components/glass-card";

describe("GlassCard", () => {
  it("renders children correctly", () => {
    render(
      <GlassCard>
        <div>Test content</div>
      </GlassCard>
    );
    
    expect(screen.getByText("Test content")).toBeInTheDocument();
  });

  it("applies default variant styles", () => {
    const { container } = render(
      <GlassCard>
        <div>Test content</div>
      </GlassCard>
    );
    
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass("backdrop-blur-md", "bg-white/5", "border-white/10");
  });

  it("applies premium variant styles", () => {
    const { container } = render(
      <GlassCard variant="premium">
        <div>Test content</div>
      </GlassCard>
    );
    
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass("bg-white/15", "border-white/30", "shadow-gold/20");
  });

  it("applies luxury variant styles", () => {
    const { container } = render(
      <GlassCard variant="luxury">
        <div>Test content</div>
      </GlassCard>
    );
    
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass("bg-gradient-to-br", "from-white/20", "to-white/5", "border-gold/30");
  });

  it("applies different padding sizes", () => {
    const { container: containerSm } = render(
      <GlassCard padding="sm">
        <div>Test content</div>
      </GlassCard>
    );
    
    const { container: containerXl } = render(
      <GlassCard padding="xl">
        <div>Test content</div>
      </GlassCard>
    );
    
    const cardSm = containerSm.firstChild as HTMLElement;
    const cardXl = containerXl.firstChild as HTMLElement;
    
    expect(cardSm).toHaveClass("p-4");
    expect(cardXl).toHaveClass("p-12");
  });

  it("applies custom className", () => {
    const { container } = render(
      <GlassCard className="custom-class">
        <div>Test content</div>
      </GlassCard>
    );
    
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass("custom-class");
  });
});
