async function sendMessage() {
    const userInput = document.getElementById('userInput').value;
  
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: userInput })
      });
  
      const data = await response.json();
      const chatbox = document.getElementById('chatbox');
  
      chatbox.innerHTML += `<p><strong>Você:</strong> ${userInput}</p>`;
      chatbox.innerHTML += `<p><strong>ChatGPT:</strong> ${data.reply}</p>`;
  
      // Limpar o input
      document.getElementById('userInput').value = '';
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    }
  }
  