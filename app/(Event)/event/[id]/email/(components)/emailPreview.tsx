'use client'

interface EmailPreviewProps {
  headerImage: string
  content: string
  footerImage: string
  backgroundColor: string
}

export function EmailPreview({
  headerImage,
  content,
  footerImage,
  backgroundColor,
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
						margin: 0;
						padding: 0;
					}
					.container {
						max-width: 600px;
						width: 100%;
						margin: 0 auto;
            background-color: ${backgroundColor};
					}
					.img-container img {
						width: 100%;
            height: auto;
            object-fit: cover;
            object-position: center;
					}
				</style>
			</head>
		<body>
		<table class="container" role="presentation" cellspacing="0" cellpadding="0">
			<tr>
				<td class="img-container">
					<img src="${headerImage}" alt="Header" />
				</td>
			</tr>
			<tr>
				<td>
					<div>${content}</div>
				</td>
			</tr>
			<tr>
				<td class="img-container">
					<img src="${footerImage}" alt="Footer" />
				</td>
			</tr>
		</table>
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
