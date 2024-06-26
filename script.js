function vote(candidate) {
    fetch('https://git.heroku.com/murmuring-citadel-94432.git', { // Remplace par ton URL publique ngrok
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
