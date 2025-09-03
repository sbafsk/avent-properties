import React, { useState, useMemo } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command'
import { Check, ChevronsUpDown } from 'lucide-react'

interface SelectFieldProps<T> {
  label: string
  name: string
  options: T[]
  value?: T
  onChange: (value: T) => void
  getOptionLabel: (option: T) => string
  getOptionValue: (option: T) => string
  placeholder?: string
  required?: boolean
  error?: string
  disabled?: boolean
  searchable?: boolean
  className?: string
}

export function SelectField<T>({
  label,
  name,
  options,
  value,
  onChange,
  getOptionLabel,
  getOptionValue,
  placeholder = "Select an option",
  required = false,
  error,
  disabled = false,
  searchable = false,
  className
}: SelectFieldProps<T>) {
  const id = `select-${name}`
  const [open, setOpen] = useState(false)
  const [searchValue, setSearchValue] = useState("")
  
  const filteredOptions = useMemo(() => {
    if (!searchable || !searchValue) return options
    
    return options.filter(option =>
      getOptionLabel(option).toLowerCase().includes(searchValue.toLowerCase())
    )
  }, [options, searchValue, searchable, getOptionLabel])
  
  const selectedOption = useMemo(() => {
    return value ? options.find(option => getOptionValue(option) === getOptionValue(value)) : null
  }, [options, value, getOptionValue])
  
  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={id} className="text-sm font-medium">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full justify-between",
              error && "border-red-500",
              disabled && "opacity-50 cursor-not-allowed"
            )}
            disabled={disabled}
            aria-describedby={error ? `${id}-error` : undefined}
            aria-invalid={!!error}
            aria-required={required}
          >
            {selectedOption ? getOptionLabel(selectedOption) : placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            {searchable && (
              <CommandInput 
                placeholder="Search options..." 
                value={searchValue}
                onValueChange={setSearchValue}
              />
            )}
            <CommandEmpty>No options found.</CommandEmpty>
            <CommandGroup>
              {filteredOptions.map((option) => (
                <CommandItem
                  key={getOptionValue(option)}
                  value={getOptionValue(option)}
                  onSelect={() => {
                    onChange(option)
                    setOpen(false)
                    setSearchValue("")
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value && getOptionValue(option) === getOptionValue(value)
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {getOptionLabel(option)}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
      
      {error && (
        <p id={`${id}-error`} className="text-sm text-red-500" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
