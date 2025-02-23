const express = require('express');
const multer = require('multer');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const unzipper = require('unzipper');

console.log("Iniciando servidor...");

const app = express();
const upload = multer({ dest: 'uploads/' });
let botProcess = null;

app.use(express.static(__dirname));
console.log("Middleware configurado");

app.post('/upload', upload.single('bot-file'), (req, res) => {
    console.log("Requisição de upload recebida");
    if (!req.file) {
        console.log("Nenhum arquivo enviado");
        return res.json({ success: false, message: 'Nenhum arquivo enviado.' });
    }

    const filePath = req.file.path;
    const extractPath = path.join(__dirname, 'bots', req.file.filename);
    console.log(`Descompactando ${filePath} para ${extractPath}`);

    fs.mkdirSync(extractPath, { recursive: true });
    fs.createReadStream(filePath)
        .pipe(unzipper.Extract({ path: extractPath }))
        .on('close', () => {
            console.log("Arquivo descompactado com sucesso");
            fs.unlinkSync(filePath);
            res.json({ success: true });
        })
        .on('error', (err) => {
            console.log("Erro ao descompactar: " + err.message);
            res.json({ success: false, message: 'Erro ao descompactar o ZIP: ' + err.message });
        });
});

app.post('/start', async (req, res) => {
    console.log("Requisição para iniciar bot recebida");
    if (botProcess) {
        console.log("Bot já está rodando");
        return res.json({ success: false, message: 'Bot já está rodando.' });
    }

    const botDir = path.join(__dirname, 'bots');
    let botFolder;
    try {
        const folders = fs.readdirSync(botDir);
        botFolder = folders[0];
        if (!botFolder) {
            console.log("Nenhum bot encontrado no diretório");
            return res.json({ success: false, message: 'Nenhum bot encontrado. Faça upload primeiro.' });
        }
    } catch (err) {
        console.log("Erro ao ler diretório de bots: " + err.message);
        return res.json({ success: false, message: 'Erro ao acessar bots: ' + err.message });
    }

    const botPath = path.join(botDir, botFolder);
    console.log(`Iniciando bot em ${botPath}`);

    if (!fs.existsSync(path.join(botPath, 'index.js'))) {
        console.log("index.js não encontrado no bot");
        return res.json({ success: false, message: 'Arquivo index.js não encontrado no bot.' });
    }

    const nodeModulesPath = path.join(botPath, 'node_modules');
    if (fs.existsSync(nodeModulesPath)) {
        console.log("Limpando pasta node_modules existente...");
        try {
            fs.rmSync(nodeModulesPath, { recursive: true, force: true });
            console.log("Pasta node_modules limpa com sucesso");
        } catch (err) {
            console.log("Erro ao limpar node_modules: " + err.message);
            return res.json({ success: false, message: 'Erro ao limpar dependências antigas: ' + err.message });
        }
    }

    console.log("Instalando dependências do bot...");
    exec('npm install', { cwd: botPath }, (err, stdout, stderr) => {
        if (err) {
            console.log("Erro ao instalar dependências: " + err.message);
            console.log("stderr: " + stderr);
            return res.json({ success: false, message: 'Erro ao instalar dependências: ' + stderr });
        }
        console.log("Dependências instaladas com sucesso");
        console.log("stdout: " + stdout);

        botProcess = exec('node index.js', { cwd: botPath });
        botProcess.stdout.on('data', (data) => {
            console.log('Bot stdout: ' + data);
        });
        botProcess.stderr.on('data', (data) => {
            console.log('Bot stderr: ' + data);
        });
        botProcess.on('error', (err) => {
            console.log('Erro ao executar o bot: ' + err.message);
            botProcess = null;
        });
        botProcess.on('close', (code) => {
            console.log('Bot fechado com código: ' + code);
            botProcess = null;
        });
        res.json({ success: true });
    });
});

app.post('/stop', (req, res) => {
    console.log("Requisição para parar bot recebida");
    if (botProcess) {
        botProcess.kill();
        botProcess = null;
        console.log("Bot parado");
        res.json({ success: true });
    } else {
        console.log("Nenhum bot rodando para parar");
        res.json({ success: false, message: 'Nenhum bot rodando.' });
    }
});

app.post('/delete', (req, res) => {
    console.log("Requisição para excluir bot recebida");
    if (botProcess) {
        botProcess.kill();
        botProcess = null;
        console.log("Bot parado antes de excluir");
    }

    const botDir = path.join(__dirname, 'bots');
    try {
        fs.rmSync(botDir, { recursive: true, force: true });
        fs.mkdirSync(botDir, { recursive: true });
        console.log("Diretório de bots limpo com sucesso");
        res.json({ success: true });
    } catch (err) {
        console.log("Erro ao excluir bots: " + err.message);
        res.json({ success: false, message: 'Erro ao excluir o bot: ' + err.message });
    }
});

// Use a porta do Heroku ou 5000 localmente
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));