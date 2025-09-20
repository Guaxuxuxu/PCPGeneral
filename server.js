import express from 'express';
import bodyParser from 'body-parser';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import XLSX from 'xlsx';
import nodemailer from 'nodemailer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public')); // servir HTML e JS

// Conexão SQLite
const dbPromise = open({
  filename: path.join(__dirname, 'agendamentos.db'),
  driver: sqlite3.Database
});

// Inicializar banco e criar tabela se não existir
const initDb = async () => {
  const db = await dbPromise;
  await db.run(`
    CREATE TABLE IF NOT EXISTS agendamentos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT,
      email TEXT,
      telefone TEXT,
      servico TEXT,
      data TEXT
    )
  `);
};
await initDb();

// Rota para receber formulário
app.post('/send', async (req, res) => {
  try {
    const { name, email, phone, service, schedule } = req.body;
    console.log(req.body);
    const db = await dbPromise;

    // Salvar no banco
    await db.run(
      `INSERT INTO agendamentos (nome,email,telefone,servico,data) VALUES (?,?,?,?,?)`,
      [name, email, phone, service, schedule]
    );

    // Pegar todos os agendamentos
    const agendamentos = await db.all(`SELECT * FROM agendamentos`);

    // Gerar Excel
    const worksheet = XLSX.utils.json_to_sheet(agendamentos);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Agendamentos');
    const filename = 'agendamentos.xlsx';
    const filepath = path.join(__dirname, filename);
    XLSX.writeFile(workbook, filepath);

   // Configurar Nodemailer com Gmail
    const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'guilherme.nasc.sac@gmail.com',
                pass: 'viav skoj ujcq vruo'
                }
    });

    const mailOptions = {
      from: 'email que enviará as infos',
      to: 'guilherme.isac@estudante.iftm.edu.br', //TODO: aqui tá enviando para o usuário, mas pode ser um email padrão. 
      subject: 'Planilha com dados do formulário',
      text: 'Segue em anexo o Excel com os dados enviados pelo formulário.',
      attachments: [
        { path: filepath, filename: 'dados.xlsx' }
      ]
    };

    await transporter.sendMail(mailOptions);

    // Remover Excel temporário
    fs.unlinkSync(filepath);

    res.send('Email enviado com sucesso com todos os agendamentos!');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao enviar email: ' + err.message);
  }
});

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
