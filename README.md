# CadastroCarnes - Frontend

Frontend do sistema CadastroCarnes, desenvolvido em React com Vite.

Aplicação responsável pela interface do usuário, gerenciamento das telas e comunicação com a API Backend.

## Tecnologias utilizadas

- React
- Vite
- JavaScript
- CSS
- Axios

## Funcionalidades

- Cadastro de carnes
- Cadastro de compradores
- Cadastro de localidades
- Cadastro de pedidos
- Integração com API REST
- Navegação entre telas

---

# Como executar o Frontend localmente

## Pré-requisitos

Instalar:

- Node.js
- npm

Verificar instalação:

bash
node -v
npm -v


## Clonar o projeto

bash
git clone https://github.com/thomaskhris-hub/CadastroCarnes.git


Entrar na pasta:

bash
cd CadastroCarnes


Instalar dependências:

bash
npm install


Executar o projeto:

bash
npm run dev


O sistema estará disponível em:

http://localhost:5173


## Configuração da API

Este frontend utiliza a API:


https://github.com/thomaskhris-hub/CadastroCarnesApi


A URL da API deve ser configurada no arquivo:

src/api/api.js

# Estrutura dos projetos

## Frontend

CadastroCarnes.Web

src
├── api
├── assets
├── layout
├── pages
├── services
├── App.jsx
└── main.jsx

## Backend


CadastroCarnes.Api

├── Controllers
├── Models
├── Data
├── Services
├── Migrations
├── Program.cs
└── appsettings.json


---

# Repositórios

Frontend:


https://github.com/thomaskhris-hub/CadastroCarnes


Backend:

https://github.com/thomaskhris-hub/CadastroCarnesApi
