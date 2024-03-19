# FIAP TECH CHALLENGE ORDER

## Primeiros Passos

Estas instruções irão ajudá-lo a obter uma cópia do projeto em sua máquina local para fins de desenvolvimento e testes.

### Pré-requisitos

O que você precisa instalar na sua máquina local.

- Node.js (v20.11)
- Docker

### Instalação

Como configurar o ambiente de desenvolvimento.

```bash
# Clone o repositório
git clone https://github.com/souzantero/fiap-tech-challenge-order.git

# Acesse o diretório
cd fiap-tech-challenge-order/

# Instale as dependências
npm install
```

## Iniciando o servidor

Como iniciar o servidor em modo de desenvolvimento.

Crie um arquivo `.env` na raiz do diretório e cole o seguinte conteúdo.

```
PORT=_PORT_
DATABASE_URL=_DATABASE_URL_
AUTHENTICATION_URL=_AUTHENTICATION_URL_
PRODUCT_URL=_PRODUCT_URL_
AWS_ACCESS_KEY_ID=_AWS_ACCESS_KEY_ID_
AWS_SECRET_ACCESS_KEY=_AWS_SECRET_ACCESS_KEY_
AWS_REGION=_AWS_REGION_
AWS_SQS_ORDER_ADDED_QUEUE_URL=_AWS_SQS_ORDER_ADDED_QUEUE_URL_
AWS_SQS_PAYMENT_APPROVED_QUEUE_URL=_AWS_SQS_PAYMENT_APPROVED_QUEUE_URL_
AWS_SQS_PAYMENT_REJECTED_QUEUE_URL=_AWS_SQS_PAYMENT_REJECTED_QUEUE_URL_
AWS_SQS_PAYMENT_APPROVED_QUEUE_ARN=_AWS_SQS_PAYMENT_APPROVED_QUEUE_ARN_
AWS_SQS_PAYMENT_REJECTED_QUEUE_ARN=_AWS_SQS_PAYMENT_REJECTED_QUEUE_ARN_
AWS_SNS_ORDER_ACCEPTED_TOPIC_ARN=_AWS_SNS_ORDER_ACCEPTED_TOPIC_ARN_
AWS_SNS_ORDER_CANCELLED_TOPIC_ARN=_AWS_SNS_ORDER_CANCELLED_TOPIC_ARN_
```

Não se esqueça de alterar os valores das variáveis de ambiente

Execute o serviço Docker Compose para iniciar o Mongo.

```bash
docker-compose up -d database
```

Inicie a aplicação.

```bash
npm run start:dev
```

Para iniciar em modo de produção.

```bash
npm run build
npm run start
```

## Open API

Para acessar o painel Open API e visualizar os endpoints disponíveis na API. 

`http://localhost:{port}/api/docs`

## Construído com

- [Node.js](http://www.nodejs.org/) - A estrutura do servidor em tempo de execução.
- [TypeScript](https://www.typescriptlang.org/) - Usado para tipagem estática no JavaScript.
- [Express.js](https://expressjs.com/) - Estrutura de aplicativo da web Node.js.
- [Prisma](https://www.prisma.io/) - ORM Node.js e TypeScript.

## Autores

- **Felipe Antero** - _Trabalho inicial_ - [souzantero](https://github.com/souzantero)

## Licença

Este projeto está licenciado sob a Licença MIT - consulte o arquivo [LICENSE.md](LICENSE.md) para obter detalhes.
