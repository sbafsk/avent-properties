import React from "react";
import { render, screen } from "@testing-library/react";
import { SectionHeader } from "@/components/section-header";

describe("SectionHeader", () => {
  it("renders title correctly", () => {
    render(<SectionHeader title="Test Title" />);
    
    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("Test Title");
  });

  it("renders subtitle when provided", () => {
    render(
      <SectionHeader 
        title="Test Title" 
        subtitle="Test subtitle content" 
      />
    );
    
    expect(screen.getByText("Test subtitle content")).toBeInTheDocument();
  });

  it("does not render subtitle when not provided", () => {
    render(<SectionHeader title="Test Title" />);
    
    expect(screen.queryByText("Test subtitle content")).not.toBeInTheDocument();
  });

  it("applies centered styles when centered is true", () => {
    const { container } = render(
      <SectionHeader title="Test Title" centered />
    );
    
    const header = container.firstChild as HTMLElement;
    expect(header).toHaveClass("text-center");
  });

  it("does not apply centered styles when centered is false", () => {
    const { container } = render(
      <SectionHeader title="Test Title" centered={false} />
    );
    
    const header = container.firstChild as HTMLElement;
    expect(header).not.toHaveClass("text-center");
  });

  it("applies custom className", () => {
    const { container } = render(
      <SectionHeader title="Test Title" className="custom-class" />
    );
    
    const header = container.firstChild as HTMLElement;
    expect(header).toHaveClass("custom-class");
  });

  it("applies custom title and subtitle classNames", () => {
    const { container } = render(
      <SectionHeader 
        title="Test Title" 
        subtitle="Test subtitle"
        titleClassName="custom-title-class"
        subtitleClassName="custom-subtitle-class"
      />
    );
    
    const title = screen.getByRole("heading", { level: 2 });
    const subtitle = screen.getByText("Test subtitle");
    
    expect(title).toHaveClass("custom-title-class");
    expect(subtitle).toHaveClass("custom-subtitle-class");
  });
});


