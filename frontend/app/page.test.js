import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Page from './page'

describe('Página Principal', () => {
  it('renderiza o texto principal "Get started by editing"', () => {
    render(<Page />)

    // O app padrão do Next.js tem esse texto
    const heading = screen.getByText(/Get started by editing/i)

    expect(heading).toBeInTheDocument()
  })
})