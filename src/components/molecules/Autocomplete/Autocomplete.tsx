import { useId, useState, type KeyboardEvent } from 'react'
import styles from './Autocomplete.module.css'

interface AutocompleteProps {
  label: string
  value: string
  options: readonly string[]
  onValueChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  loading?: boolean
  emptyMessage?: string
}

function Autocomplete({
  label,
  value,
  options,
  onValueChange,
  placeholder,
  disabled = false,
  loading = false,
  emptyMessage = 'No matches found',
}: AutocompleteProps) {
  const baseId = useId()
  const inputId = `${baseId}-input`
  const listboxId = `${baseId}-listbox`
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)

  const hasOptions = options.length > 0
  const showListbox = open && hasOptions
  const showEmpty = open && !hasOptions && value.trim() !== ''
  const activeOption = showListbox && activeIndex >= 0 && activeIndex < options.length ? activeIndex : -1

  const select = (option: string) => {
    onValueChange(option)
    setOpen(false)
    setActiveIndex(-1)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    switch (event.key) {
      case 'ArrowDown':
        if (!hasOptions) return
        event.preventDefault()
        setOpen(true)
        setActiveIndex((activeOption + 1) % options.length)
        break
      case 'ArrowUp':
        if (!hasOptions) return
        event.preventDefault()
        setOpen(true)
        setActiveIndex(activeOption <= 0 ? options.length - 1 : activeOption - 1)
        break
      case 'Enter':
        if (activeOption < 0) return
        event.preventDefault()
        select(options[activeOption])
        break
      case 'Escape':
        if (!open) return
        event.preventDefault()
        setOpen(false)
        break
    }
  }

  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={inputId}>
        {label}
      </label>
      <div className={styles.control}>
        <input
          id={inputId}
          className={styles.input}
          type="text"
          role="combobox"
          autoComplete="off"
          aria-autocomplete="list"
          aria-expanded={showListbox}
          aria-controls={listboxId}
          aria-activedescendant={activeOption >= 0 ? `${baseId}-option-${activeOption}` : undefined}
          aria-busy={loading || undefined}
          value={value}
          placeholder={placeholder}
          disabled={disabled || loading}
          onChange={(event) => {
            onValueChange(event.target.value)
            setOpen(true)
            setActiveIndex(-1)
          }}
          onKeyDown={handleKeyDown}
          onBlur={() => setOpen(false)}
        />
        {showListbox ? (
          <ul id={listboxId} className={styles.listbox} role="listbox" aria-label={label}>
            {options.map((option, index) => (
              <li
                key={option}
                id={`${baseId}-option-${index}`}
                className={styles.option}
                role="option"
                aria-selected={index === activeOption}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => select(option)}
              >
                {option}
              </li>
            ))}
          </ul>
        ) : null}
        {showEmpty ? (
          <p className={styles.empty} role="status">
            {emptyMessage}
          </p>
        ) : null}
      </div>
    </div>
  )
}

export default Autocomplete
