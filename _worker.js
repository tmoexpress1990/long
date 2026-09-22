// Cloudflare Worker for domain2.com
// This proxies content from 7copas.org while keeping domain2.com in the address bar

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)
  
  // Replace domain2.com with 7copas.org in the request
  url.hostname = '7copas.org'
  
  // Fetch content from the real server
  const response = await fetch(url.toString(), {
    method: request.method,
    headers: request.headers,
    body: request.body
  })
  
  // Clone response so we can modify headers
  const newResponse = new Response(response.body, response)
  
  // Remove security headers that might block the proxy
  newResponse.headers.delete('content-security-policy')
  newResponse.headers.delete('x-frame-options')
  
  return newResponse
}
