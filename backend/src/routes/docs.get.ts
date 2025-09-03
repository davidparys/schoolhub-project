export default defineEventHandler(async (event) => {
    const html = `
  <!doctype html>
  <html>
    <head>
      <title>School Hub API Documentation</title>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <style>
        body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
      </style>
    </head>
    <body>
      <script
        id="api-reference"
        data-url="/api/openapi.json"
        data-configuration='{"theme":"purple","layout":"modern","hideModels":false,"showSidebar":true}'
      ></script>
      <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>
    </body>
  </html>
  `
    return html
})
