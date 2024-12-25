'use client'

interface EmailPreviewProps {
  headerImage: string
  content: string
  footerImage: string
}

export function EmailPreview({
  headerImage,
  content,
  footerImage,
}: EmailPreviewProps) {
  const emailHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Email Preview</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
        }
        .container {
          max-width: 600px;
          height: auto;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
        }
        img {
          max-width: 100%;
          height: 200px;
          object-fit: cover;
          object-position: center;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <img src="${headerImage}" alt="Header" style="width: 100%;" />
        <div>${content}</div>
        <img src="${footerImage}" alt="Footer" style="width: 100%;" />
      </div>
    </body>
    </html>
  `

  return (
    <div className="mt-8">
      <h2 className="mb-2 text-lg font-semibold">Email Preview</h2>
      <div className="border p-4">
        <iframe
          srcDoc={emailHtml}
          width="100%"
          height="600"
          title="Email Preview"
          className="w-full border-none"
        />
      </div>
    </div>
  )
}
