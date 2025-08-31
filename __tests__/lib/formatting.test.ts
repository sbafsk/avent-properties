import {
    formatPrice,
    formatArea,
    formatDate,
    formatDateTime,
    formatPropertyType,
    formatLocation,
    truncateText,
    formatPhoneNumber,
    formatFileSize,
} from "@/lib/formatting";

describe("formatting utilities", () => {
    describe("formatPrice", () => {
        it("formats USD price correctly", () => {
            expect(formatPrice(1500000, "USD")).toBe("$1,500,000");
            expect(formatPrice(500000, "USD")).toBe("$500,000");
            expect(formatPrice(0, "USD")).toBe("$0");
        });

        it("uses USD as default currency", () => {
            expect(formatPrice(1000000)).toBe("$1,000,000");
        });

        it("formats EUR price correctly", () => {
            expect(formatPrice(1500000, "EUR")).toBe("€1,500,000");
        });
    });

    describe("formatArea", () => {
        it("formats area with square meters", () => {
            expect(formatArea(250)).toBe("250m²");
            expect(formatArea(1000)).toBe("1,000m²");
            expect(formatArea(0)).toBe("0m²");
        });
    });

    describe("formatDate", () => {
        it("formats date string correctly", () => {
            const date = "2024-01-15T12:00:00Z"; // Use UTC to avoid timezone issues
            const result = formatDate(date);
            expect(result).toMatch(/January 15, 2024/);
        });

        it("formats Date object correctly", () => {
            const date = new Date("2024-01-15T12:00:00Z"); // Use UTC to avoid timezone issues
            const result = formatDate(date);
            expect(result).toMatch(/January 15, 2024/);
        });
    });

    describe("formatDateTime", () => {
        it("formats date and time correctly", () => {
            const date = "2024-01-15T14:30:00";
            const result = formatDateTime(date);
            expect(result).toMatch(/Jan 15, 2024/);
            expect(result).toMatch(/2:30/);
        });
    });

    describe("formatPropertyType", () => {
        it("formats property type with underscores", () => {
            expect(formatPropertyType("luxury_villa")).toBe("Luxury Villa");
            expect(formatPropertyType("beach_house")).toBe("Beach House");
            expect(formatPropertyType("apartment")).toBe("Apartment");
        });

        it("handles single word property types", () => {
            expect(formatPropertyType("house")).toBe("House");
        });
    });

    describe("formatLocation", () => {
        it("formats location with city and neighborhood", () => {
            expect(formatLocation("Punta del Este", "La Barra")).toBe("Punta del Este, La Barra");
        });

        it("formats location with city only", () => {
            expect(formatLocation("Punta del Este")).toBe("Punta del Este");
        });

        it("handles undefined neighborhood", () => {
            expect(formatLocation("Punta del Este", undefined)).toBe("Punta del Este");
        });
    });

    describe("truncateText", () => {
        it("truncates text longer than max length", () => {
            const text = "This is a very long text that should be truncated";
            expect(truncateText(text, 20)).toBe("This is a very long...");
        });

        it("returns original text if shorter than max length", () => {
            const text = "Short text";
            expect(truncateText(text, 20)).toBe("Short text");
        });

        it("handles exact length", () => {
            const text = "Exactly twenty chars";
            expect(truncateText(text, 20)).toBe("Exactly twenty chars");
        });
    });

    describe("formatPhoneNumber", () => {
        it("formats 10-digit US phone number", () => {
            expect(formatPhoneNumber("1234567890")).toBe("(123) 456-7890");
        });

        it("formats 11-digit US phone number with country code", () => {
            expect(formatPhoneNumber("11234567890")).toBe("+1 (123) 456-7890");
        });

        it("returns original if can't format", () => {
            expect(formatPhoneNumber("123")).toBe("123");
        });

        it("handles phone numbers with formatting", () => {
            expect(formatPhoneNumber("(123) 456-7890")).toBe("(123) 456-7890");
        });
    });

    describe("formatFileSize", () => {
        it("formats bytes correctly", () => {
            expect(formatFileSize(0)).toBe("0 Bytes");
            expect(formatFileSize(1024)).toBe("1 KB");
            expect(formatFileSize(1048576)).toBe("1 MB");
            expect(formatFileSize(1073741824)).toBe("1 GB");
        });

        it("formats decimal sizes correctly", () => {
            expect(formatFileSize(1536)).toBe("1.5 KB");
            expect(formatFileSize(1572864)).toBe("1.5 MB");
        });
    });
});
