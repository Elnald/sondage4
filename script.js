function vote(candidate) {
    fetch('https://nextjs-theta-lime-54.vercel.app/api/vote', { // Remplace par ton URL publique ngrok
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ candidate: candidate }),
    })
    .then(response => response.text())
    .then(message => alert(message))
    .catch(error => console.error('Error:', error));
}
