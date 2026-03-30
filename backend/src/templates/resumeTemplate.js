const resumeTemplate = (data) => `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<style>
  body { font-family: Arial, sans-serif; padding: 40px; color: #222; }
  h1 { margin-bottom: 5px; }
  h2 { margin-top: 25px; border-bottom: 1px solid #ccc; padding-bottom: 5px; }
  ul { margin: 0; padding-left: 18px; }
</style>
</head>
<body>

<h1>${data.name}</h1>
<p>${data.email} | ${data.phone}</p>

<h2>Summary</h2>
<p>${data.summary}</p>

<h2>Skills</h2>
<ul>
${data.skills.map(s => `<li>${s}</li>`).join("")}
</ul>

<h2>Projects</h2>
<ul>
${data.projects.map(p => `<li><b>${p.title}</b>: ${p.description}</li>`).join("")}
</ul>

<h2>Education</h2>
<p>${data.education}</p>

</body>
</html>
`;

module.exports = { resumeTemplate };