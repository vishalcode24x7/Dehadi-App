import { useRef } from 'react'

function PinInput({ value, onChange, label }) {
  const inputs = useRef([])
  const digits = String(value || '').padEnd(6, ' ').slice(0, 6).split('')

  const setDigit = (index, digit) => {
    const nextDigits = [...digits]
    nextDigits[index] = digit
    onChange(nextDigits.join('').replaceAll(' ', ''))
  }

  const handleChange = (index, event) => {
    const digit = event.target.value.replace(/\D/g, '').slice(-1)
    if (digit) {
      setDigit(index, digit)
      if (index < 5) {
        inputs.current[index + 1]?.focus()
      }
    }
  }

  const handleKeyDown = (index, event) => {
    if (event.key === 'Backspace' && !digits[index].trim() && index > 0) {
      inputs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (event) => {
    event.preventDefault()
    const pasted = event.clipboardData
      .getData('text')
      .replace(/\D/g, '')
      .slice(0, 6)
    if (pasted) {
      onChange(pasted)
      inputs.current[Math.min(pasted.length, 5)]?.focus()
    }
  }

  return (
    <div className="flex justify-between gap-1.5" onPaste={handlePaste}>
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(element) => {
            inputs.current[index] = element
          }}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={digit.trim()}
          aria-label={`${label} ${index + 1}`}
          onChange={(event) => handleChange(index, event)}
          onKeyDown={(event) => handleKeyDown(index, event)}
          className="h-11 w-full min-w-0 rounded-lg border border-slate-300 text-center text-lg outline-none focus:border-slate-700"
        />
      ))}
    </div>
  )
}

export default PinInput
