import { useId, useState, type FocusEvent, type KeyboardEvent, type UIEvent } from 'react'
import Button from '../../atoms/Button/Button'
import styles from './Autocomplete.module.css'

const OPTION_HEIGHT = 40
const VISIBLE_OPTIONS = 5
const OVERSCAN = 2
const VIEWPORT_HEIGHT = OPTION_HEIGHT * VISIBLE_OPTIONS

interface AutocompleteProps {
  label: string
  value: string
  options: readonly string[]
  onValueChange: (value: string) => void
  hasMore?: boolean
  loadingMore?: boolean
  onLoadMore?: () => void
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
  hasMore = false,
  loadingMore = false,
  onLoadMore,
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
  const [scrollTop, setScrollTop] = useState(0)

  const hasOptions = options.length > 0
  const showListbox = open && hasOptions
  const showEmpty = open && !hasOptions && value.trim() !== ''
  const activeOption = showListbox && activeIndex >= 0 && activeIndex < options.length ? activeIndex : -1

  const maxScrollTop = Math.max(0, options.length * OPTION_HEIGHT - VIEWPORT_HEIGHT)
  const firstVisible = Math.floor(Math.min(scrollTop, maxScrollTop) / OPTION_HEIGHT)
  const windowStart = Math.max(0, firstVisible - OVERSCAN)
  const windowEnd = Math.min(options.length, firstVisible + VISIBLE_OPTIONS + OVERSCAN + 1)

  const select = (option: string) => {
    onValueChange(option)
    setOpen(false)
    setActiveIndex(-1)
  }

  const moveTo = (index: number) => {
    const top = index * OPTION_HEIGHT
    const bottom = top + OPTION_HEIGHT
    setOpen(true)
    setActiveIndex(index)
    if (top < scrollTop) setScrollTop(top)
    else if (bottom > scrollTop + VIEWPORT_HEIGHT) setScrollTop(bottom - VIEWPORT_HEIGHT)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    switch (event.key) {
      case 'ArrowDown':
        if (!hasOptions) return
        event.preventDefault()
        moveTo((activeOption + 1) % options.length)
        break
      case 'ArrowUp':
        if (!hasOptions) return
        event.preventDefault()
        moveTo(activeOption <= 0 ? options.length - 1 : activeOption - 1)
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

  const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false)
  }

  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={inputId}>
        {label}
      </label>
      <div className={styles.control} onBlur={handleBlur}>
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
            setScrollTop(0)
          }}
          onKeyDown={handleKeyDown}
        />
        {showListbox ? (
          <div
            className={styles.popup}
            style={{ maxHeight: VIEWPORT_HEIGHT }}
            ref={(node) => {
              if (node) node.scrollTop = scrollTop
            }}
            onScroll={(event: UIEvent<HTMLDivElement>) => setScrollTop(event.currentTarget.scrollTop)}
          >
            <ul id={listboxId} className={styles.listbox} role="listbox" aria-label={label} style={{ height: options.length * OPTION_HEIGHT }}>
              {options.slice(windowStart, windowEnd).map((option, offset) => {
                const index = windowStart + offset
                return (
                  <li
                    key={option}
                    id={`${baseId}-option-${index}`}
                    className={styles.option}
                    style={{ top: index * OPTION_HEIGHT, height: OPTION_HEIGHT }}
                    role="option"
                    aria-selected={index === activeOption}
                    aria-posinset={index + 1}
                    aria-setsize={options.length}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => select(option)}
                  >
                    {option}
                  </li>
                )
              })}
            </ul>
            {hasMore ? (
              <div className={styles.footer} onMouseDown={(event) => event.preventDefault()}>
                <Button variant="secondary" loading={loadingMore} onClick={onLoadMore}>
                  Load more
                </Button>
              </div>
            ) : null}
          </div>
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
