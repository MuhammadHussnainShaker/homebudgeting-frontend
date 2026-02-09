const defaultHeaders = { 'Content-Type': 'application/json' }

function buildFetchOptions(options = {}) {
  return {
    credentials: 'include',
    ...options,
    headers: { ...defaultHeaders, ...(options.headers ?? {}) },
  }
}

function buildFallbackMessage(url) {
  return `Request to ${url} failed`
}

async function parseErrorMessage(response, fallback) {
  const text = await response.text()
  let message = fallback || response.statusText || 'Request failed'

  if (!text) return message

  try {
    const errJson = JSON.parse(text)
    return errJson?.message ?? errJson?.error ?? message
  } catch {
    return text || message
  }
}

export async function apiFetch(url, options = {}) {
  const response = await fetch(url, buildFetchOptions(options))
  const data = await response.json()

  if (!response.ok || data?.success === false) {
    throw new Error(data?.message || data?.error || buildFallbackMessage(url))
  }

  return data
}

export async function apiFetchWithTextFallback(url, options = {}) {
  const response = await fetch(url, buildFetchOptions(options))

  if (!response.ok) {
    const message = await parseErrorMessage(response, buildFallbackMessage(url))
    throw new Error(message)
  }

  const data = await response.json()

  if (data?.success === false) {
    throw new Error(data?.message || data?.error || buildFallbackMessage(url))
  }

  return data
}
