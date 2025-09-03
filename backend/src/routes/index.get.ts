export default defineEventHandler(async (event) => {
    const html = `
  <!doctype html>
  <html>
    <head>
      <title>School Hub API Documentation</title>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <style>
        body {
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
        }
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          text-align: center;
          color: white;
          margin-bottom: 40px;
        }
        .header h1 {
          font-size: 3rem;
          margin-bottom: 10px;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        .header p {
          font-size: 1.2rem;
          opacity: 0.9;
        }
        .api-info {
          background: white;
          border-radius: 12px;
          padding: 30px;
          margin-bottom: 30px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
        .api-info h2 {
          color: #333;
          margin-bottom: 20px;
        }
        .endpoints {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
          margin-top: 20px;
        }
        .endpoint {
          background: #f8f9fa;
          border-left: 4px solid #667eea;
          padding: 15px;
          border-radius: 8px;
        }
        .endpoint h3 {
          margin: 0 0 10px 0;
          color: #333;
        }
        .endpoint p {
          margin: 0;
          color: #666;
          font-size: 0.9rem;
        }
        .docs-link {
          text-align: center;
          margin-top: 30px;
        }
        .docs-btn {
          display: inline-block;
          background: #667eea;
          color: white;
          padding: 15px 30px;
          text-decoration: none;
          border-radius: 8px;
          font-weight: bold;
          transition: all 0.3s ease;
        }
        .docs-btn:hover {
          background: #5a6fd8;
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        }
        .health-check {
          background: #e8f5e8;
          border-left: 4px solid #28a745;
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 20px;
        }
        .health-check h3 {
          margin: 0 0 10px 0;
          color: #155724;
        }
        .health-check p {
          margin: 0;
          color: #155724;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🏫 School Hub API</h1>
          <p>A comprehensive REST API for managing students, classes, and class assignments</p>
        </div>

        <div class="health-check">
          <h3>✅ API Status</h3>
          <p>Server is running successfully</p>
        </div>

        <div class="api-info">
          <h2>🚀 Quick Start</h2>
          <p>This API provides endpoints for managing students, classes, and their relationships in a school management system.</p>

          <div class="endpoints">
            <div class="endpoint">
              <h3>Students</h3>
              <p>CRUD operations for student management including class assignments</p>
            </div>
            <div class="endpoint">
              <h3>Classes</h3>
              <p>CRUD operations for class management and student enrollment</p>
            </div>
            <div class="endpoint">
              <h3>Assignments</h3>
              <p>Manage student-class relationships and enrollment</p>
            </div>
          </div>
        </div>

        <div class="docs-link">
          <a href="/docs" class="docs-btn">📖 View Interactive API Documentation</a>
        </div>
      </div>
    </body>
  </html>
  `
    return html
})
