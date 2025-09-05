# PCPGeneral
Site comissão

# Generation Builders - Formulário com Excel e Email

Este projeto permite que usuários enviem dados de um formulário, que são armazenados em um banco de dados SQLite, gerando uma planilha Excel com todos os agendamentos e enviando por email usando Nodemailer.

---

## Pré-requisitos

* Node.js >= 18
* NPM ou Yarn
* Conta Gmail com **2FA** ativa e **App Password** gerada

---

## Instalação

1. Clone o repositório ou copie os arquivos para sua máquina:

```bash
git clone <URL_DO_REPOSITORIO>
cd PCP
```

2. Instale as dependências:

```bash
npm install express body-parser sqlite3 sqlite xlsx nodemailer
```

---

## Estrutura do projeto

```
PCP/
├─ public/
│  ├─ index.html
│  └─ style/index.css
├─ server.js
├─ package.json
└─ agendamentos.db (gerado automaticamente)
```

---

## Configuração do Gmail

1. Ative **2FA** na sua conta Gmail.
2. Crie uma **App Password**:

   * Acesse [Minha Conta Google](https://myaccount.google.com/security)
   * Em “App Passwords”, gere uma senha para **Mail**.
   * Copie a senha gerada.
3. Substitua no `server.js`:

```js
auth: {
    user: 'SEU_EMAIL@gmail.com',
    pass: 'SUA_APP_PASSWORD'
}
```

---

## Rodando o servidor

```bash
node server.js
```

O servidor iniciará na porta 3000:

```
Servidor rodando na porta 3000
```

---

## Usando a aplicação

1. Abra o navegador em: [http://localhost:3000](http://localhost:3000)
2. Preencha o formulário com nome, email, telefone, serviço e data.
3. Clique em **Schedule a Free Consultation**.
4. O servidor vai:

   * Salvar os dados no banco SQLite
   * Gerar o arquivo `agendamentos.xlsx` com todos os agendamentos
   * Enviar o Excel para o email informado

---

## Observações

* Cada envio adiciona um novo agendamento no banco.
* A planilha anexada no email sempre contém todos os agendamentos já registrados.
* Para testar envio de email sem Gmail, você pode usar serviços como [Mailtrap](https://mailtrap.io/).

---

## Dependências

* [Express](https://expressjs.com/)
* [Body-parser](https://www.npmjs.com/package/body-parser)
* [SQLite3](https://www.npmjs.com/package/sqlite3)
* [SQLite](https://www.npmjs.com/package/sqlite)
* [XLSX (SheetJS)](https://www.npmjs.com/package/xlsx)
* [Nodemailer](https://nodemailer.com/)

---

## Autor

Raquel Boaventura
