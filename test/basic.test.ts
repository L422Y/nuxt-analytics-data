import { describe, it, expect } from 'vitest'
import { fileURLToPath } from 'node:url'
import { setup, $fetch } from '@nuxt/test-utils'

describe('ssr', async () => {
  await setup({
    rootDir: fileURLToPath(new URL('./fixtures/basic', import.meta.url)),
  })

  it('renders the index page', async () => {
    // Get response to a server-rendered page with `$fetch`.
    const html = await $fetch('/')
    expect(html).toContain('<h2>Popular Data</h2>')
  })

  it('filters exact paths from results', async () => {
    const html = await $fetch('/')
    expect(html).toMatch(/::\/blog\/.*::/)
    expect(html).not.toContain('::/blog::')
  })

  it('filters regEx paths from results', async () => {
    const html = await $fetch('/')
    expect(html).not.toMatch(/::\/projects\/.*::/)
    expect(html).toContain('::/projects::')
  })
})
