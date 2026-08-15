/**
 * Global search, built as a registry of providers.
 *
 * The thing that makes a global search painful later is a search box that knows
 * about every feature: every new feature has to edit it, and it ends up holding
 * logic for devices, elements, actions and settings at once. Inverting it costs
 * almost nothing now and removes that problem entirely - each feature registers
 * what it can find, and the search box only merges and ranks.
 *
 * A provider:
 *
 *     registerSearchProvider({
 *       id: 'devices',
 *       group: 'Devices',
 *       search: async (query) => [{ id, title, subtitle, run }],
 *     })
 *
 * `search` may be async, so a provider backed by an API endpoint fits without
 * changing anything here. Providers that throw or hang are skipped rather than
 * taking the whole search down with them.
 */

const providers = new Map()

export function registerSearchProvider(provider) {
  providers.set(provider.id, provider)
  return () => providers.delete(provider.id)
}

export function searchProviders() {
  return [...providers.values()]
}

/**
 * Ask every provider, keep whatever answers in time.
 *
 * One slow or broken provider must not stall the palette, so results are
 * collected with allSettled and failures are dropped.
 */
export async function runSearch(query) {
  const term = query.trim()
  if (!term) return []

  const answers = await Promise.allSettled(
    searchProviders().map(async (provider) => {
      const results = await provider.search(term)
      return results.map((result) => ({ ...result, group: result.group ?? provider.group }))
    }),
  )

  return answers
    .filter((answer) => answer.status === 'fulfilled')
    .flatMap((answer) => answer.value)
}

/** Case-insensitive substring match, the default for simple in-memory providers. */
export function matches(term, ...fields) {
  const needle = term.toLowerCase()
  return fields.some((field) => String(field ?? '').toLowerCase().includes(needle))
}
