import { render, screen } from '@testing-library/react'
import ProjectCard from '@/components/ProjectCard'

describe('ProjectCard', () => {
  it('renders name, description and link', () => {
    render(<ProjectCard name="个人项目展示网站" description="静态首页与项目展示" url="https://example.com/repo" />)

    expect(screen.getByText('个人项目展示网站')).toBeInTheDocument()
    expect(screen.getByText('静态首页与项目展示')).toBeInTheDocument()
    const link = screen.getByRole('link', { name: '打开仓库' }) as HTMLAnchorElement
    expect(link).toHaveAttribute('href', 'https://example.com/repo')
  })
})