async function testPost() {
  const response = await fetch('http://localhost:3000/api/internships', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: "Frontend Developer Intern",
      company: "EdVyro",
      location: "Remote",
      stipend: "$600/mo",
      category: "Frontend"
    })
  });
  const data = await response.json();
  console.log("Response:", data);
}
testPost();