function logMessage(message) {
    const logs = document.getElementById('logs');
    logs.innerHTML += `<p>${message}</p>`;
    logs.scrollTop = logs.scrollHeight;
}

function updateButtons(uploaded, running) {
    const startBtn = document.getElementById('start-btn');
    const stopBtn = document.getElementById('stop-btn');
    const deleteBtn = document.getElementById('delete-btn');
    const botStatus = document.getElementById('bot-status');

    deleteBtn.disabled = !uploaded;
    startBtn.disabled = !uploaded || running;
    stopBtn.disabled = !uploaded || !running;
    botStatus.textContent = running ? 'Online' : 'Desligado';
}

async function uploadBot() {
    const fileInput = document.getElementById('bot-file');
    if (!fileInput.files[0] || !fileInput.files[0].name.endsWith('.zip')) {
        logMessage('Por favor, envie um arquivo .zip válido.');
        return;
    }

    const formData = new FormData();
    formData.append('bot-file', fileInput.files[0]);

    const response = await fetch('/upload', {
        method: 'POST',
        body: formData
    });
    const result = await response.json();
    if (result.success) {
        logMessage('Arquivo enviado com sucesso!');
        updateButtons(true, false);
    } else {
        logMessage('Erro ao enviar o arquivo: ' + result.message);
    }
}

async function startBot() {
    const response = await fetch('/start', { method: 'POST' });
    const result = await response.json();
    if (result.success) {
        logMessage('Bot iniciado!');
        updateButtons(true, true);
    } else {
        logMessage('Erro ao iniciar o bot: ' + result.message);
    }
}

async function stopBot() {
    const response = await fetch('/stop', { method: 'POST' });
    const result = await response.json();
    if (result.success) {
        logMessage('Bot parado!');
        updateButtons(true, false);
    } else {
        logMessage('Erro ao parar o bot: ' + result.message);
    }
}

async function deleteBot() {
    const response = await fetch('/delete', { method: 'POST' });
    const result = await response.json();
    if (result.success) {
        logMessage('Bot excluído!');
        updateButtons(false, false);
    } else {
        logMessage('Erro ao excluir o bot: ' + result.message);
    }
}

updateButtons(false, false);