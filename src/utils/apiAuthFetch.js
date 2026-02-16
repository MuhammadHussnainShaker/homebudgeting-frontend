import { auth } from '@/services/firebase/firebaseClient'

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

async function parseErrorMessage(response, contentType, fallback) {
  const text = await response.text()
  if (contentType && contentType.includes('text/html')) {
    const errorText = htmlErrorParser(text)
    return errorText
  }
  let message = response.statusText || fallback || 'Request failed'

  if (!text) return message

  try {
    const errJson = JSON.parse(text)
    return errJson?.message ?? errJson?.error ?? message
  } catch {
    return text || message
  }
}

/**
 * Authenticated fetch that includes Firebase ID token in Authorization header
 * @param {string} url - The URL to fetch
 * @param {object} options - Fetch options
 * @returns {Promise} - The response data
 */
export async function apiAuthFetch(url, options = {}) {
  // Get current Firebase user's ID token
  const currentUser = auth.currentUser
  if (!currentUser) {
    throw new Error('No authenticated user found')
  }

  const idToken = await currentUser.getIdToken()

  // Add Authorization header with Bearer token
  const authOptions = {
    ...options,
    headers: {
      ...(options.headers ?? {}),
      Authorization: `Bearer ${idToken}`,
    },
  }

  const response = await fetch(url, buildFetchOptions(authOptions))
  const contentType = response.headers.get('content-type')

  if (!response.ok) {
    const message = await parseErrorMessage(
      response,
      contentType,
      buildFallbackMessage(url),
    )
    throw new Error(message)
  }

  if (contentType && contentType.includes('application/json')) {
    const data = await response.json()
    if (data?.success === false) {
      throw new Error(data?.message || data?.error || buildFallbackMessage(url))
    }
    return data
  }

  return await response.text()
}

function htmlErrorParser(textRes) {
  const parser = new DOMParser()
  const doc = parser.parseFromString(textRes, 'text/html')
  const preTag = doc.querySelector('pre')
  return preTag ? preTag.textContent : 'An unexpected server error occurred.'
}
