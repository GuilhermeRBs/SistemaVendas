# IngressosAPI - SistemaVendas

## Descrição

IngressosAPI é uma aplicação backend para gerenciamento de ingressos, permitindo que administradores criem e editem ingressos, e que usuários comprem ingressos disponíveis. A aplicação utiliza Node.js, Express, MongoDB e Handlebars para renderização de páginas.

## Funcionalidades

- Registro e login de usuários
- Criação e edição de ingressos (somente administradores)
- Compra de ingressos disponíveis
- Visualização de histórico de compras
- Logout de usuários

## Tecnologias Utilizadas

- Node.js
- Express
- MongoDB
- Mongoose
- Handlebars
- JWT (JSON Web Token)
- Bcrypt
- Dotenv

## Instalação

1. Clone o repositório:
   ```sh
   git clone https://github.com/seu-usuario/IngressosAPI.git

   Rotas
Autenticação
POST /api/auth/register - Registra um novo usuário
POST /api/auth/login - Realiza o login de um usuário

Usuários
POST /api/users/register - Registra um novo usuário (somente administradores)

Ingressos
POST /api/ingressos - Cria um novo ingresso (somente administradores)
POST /api/ingressos/:id - Atualiza um ingresso existente (somente administradores)
GET /admin/ingresso/:id - Renderiza a página de edição de ingresso (somente administradores)

Compras
POST /api/compras - Realiza a compra de um ingresso (somente usuários autenticados)


Visualização
GET /login - Renderiza a página de login
GET /register - Renderiza a página de registro
GET /home - Renderiza a página inicial com a lista de ingressos disponíveis (somente usuários autenticados)
GET /historico - Renderiza a página de histórico de compras do usuário (somente usuários autenticados)
GET /ingresso/:id - Renderiza a página de visualização de um ingresso específico (somente usuários autenticados)
GET /admin - Renderiza a página de administração (somente administradores)
GET /logout - Realiza o logout do usuário e redireciona para a página de login
GET / - Redireciona para a página de login se o usuário não estiver autenticado

IngressosAPI/
├── models/
│   ├── Compra.js
│   ├── Ingresso.js
│   └── User.js
├── routes/
│   ├── auth.js
│   ├── compras.js
│   ├── ingressos.js
│   └── users.js
├── views/
│   ├── layouts/
│   │   └── main.handlebars
│   ├── admin.handlebars
│   ├── edit-ingresso.handlebars
│   ├── historico.handlebars
│   ├── home.handlebars
│   ├── ingresso.handlebars
│   ├── login.handlebars
│   └── register.handlebars
├── .env
├── server.js
├── package.json
└── README.md
