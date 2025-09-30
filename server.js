import express from 'express';
import bodyParser from 'body-parser';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import XLSX from 'xlsx';
import nodemailer from 'nodemailer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

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
      data TEXT,
      created_at TEXT
    )
  `);

  // Adiciona coluna 'created_at' se não existir
  const pragma = await db.all(`PRAGMA table_info(agendamentos)`);
  const hasCreatedAt = pragma.some(col => col.name === 'created_at');
  if (!hasCreatedAt) {
    await db.run(`ALTER TABLE agendamentos ADD COLUMN created_at TEXT`);
    console.log("Coluna 'created_at' adicionada à tabela agendamentos.");
  }
};
await initDb();

// Rota para receber formulário
app.post('/send', async (req, res) => {
  try {
    const { name, email, phone, service, schedule } = req.body;
    console.log(req.body);
    const db = await dbPromise;

    // Salvar no banco
    const createdAt = new Date().toISOString();
    await db.run(
      `INSERT INTO agendamentos (nome,email,telefone,servico,data,created_at) VALUES (?,?,?,?,?,?)`,
      [name, email, phone, service, schedule, createdAt]
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
                user: process.env.USER,
                pass: process.env.GOOGLE_PASS
                }
    });

    const mailOptions = {
      from: 'email que enviará as infos',
      to: process.env.DEFAULT_EMAIL,
      subject: 'Planilha com dados do formulário',
      text: 'Segue em anexo o Excel com os dados enviados pelo formulário.',
      attachments: [
        { path: process.env.XLSX_FILE_PATH, filename: process.env.XLSX_FILENAME }
      ]
    };

    await transporter.sendMail(mailOptions);

    // Remover Excel temporário
    fs.unlinkSync(process.env.XLSX_FILE_PATH);

  res.json({ success: true, message: 'Email sent successfully with all appointments!' });
  } catch (err) {
    console.error(err);
  res.status(500).json({ success: false, message: 'Error sending email: ' + err.message });
  }
});

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
