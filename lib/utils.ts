import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Re-export formatting utilities
export {
  formatPrice,
  formatArea,
  formatDate,
  formatDateTime,
  formatPropertyType,
  formatLocation,
  truncateText,
  formatPhoneNumber,
  formatFileSize,
} from "./formatting";
