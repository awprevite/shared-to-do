import React from 'react'
import { expect, test } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'


/* ----- Unit Tests ----- */
// test('isDigit with digit', () => {
//   expect(isDigit('0')).toBe(true)
// })

/* ----- Integration Tests ----- */
// test('Add and compute', () => {
//   render(<App />)
//   fireEvent.click(screen.getByText('2'))
//   fireEvent.click(screen.getByText('+'))
//   fireEvent.click(screen.getByText('3'))
//   expect(screen.getByTestId('current-text')).toHaveTextContent('2+3');
//   fireEvent.click(screen.getByText('='))
//   expect(screen.getByTestId('current-text')).toHaveTextContent('5');
// })