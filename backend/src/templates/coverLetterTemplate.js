export const coverLetterTemplate = ({ coverLetter, name }) => {
  return `
    <html>
      <head>
        <style>
          body { font-family: Arial; padding: 40px; }
          h1 { text-align: center; }
          pre { white-space: pre-wrap; font-size: 14px; }
        </style>
      </head>
      <body>
        <h1>Cover Letter - ${name || ""}</h1>
        <pre>${coverLetter}</pre>
      </body>
    </html>
  `;
};