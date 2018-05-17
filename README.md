# Introdução ao Sequelize

### O que é

Sequelize é uma biblioteca que implementa um mecanismo de ORM: Object Relational Mapping (Mapeamento Objeto-Relacional). Resumidamente,
mecanismos de ORM servem para que possamos manipular bases de dados relacionais via código, ou seja, ORMs são abstrações das tabelas e
relações de um banco de dados. Em outras palavras, mapeamos as tabelas de um banco para objetos do nosso sistema.

Sequelize não é o único ORM existente. Este padrão é implementado por diversas outras bibliotecas nas mais diferentes linguagens. Alguns
exemplos são:

- [Hibernate (Java)](http://hibernate.org/orm/)
- [JPA (Java)](http://www.oracle.com/technetwork/java/javaee/tech/persistence-jsp-140049.html)
- [ActiveRecord (Ruby/Rails)](http://guides.rubyonrails.org/active_record_basics.html)
- [SqlAlchemy (Python)](https://www.sqlalchemy.org/)

### Porque usar um ORM

ORMs oferecem uma maneira flexível de integrar uma aplicação com um banco de dados relacional ao abstrair e facilitar várias preocupações e
questões com as quais teríamos que lidar na hora de uma integração. De maneira simplificada, ORMs ajudam devas e devs a não precisarem
reinventar rodas na hora de se integrar à um banco de dados. Algumas das facilidades proporcionadas por ORMs geralmente são coisas como:

__Abstração em relação à qual banco de dados se está usando__

ORMs geralmente oferecem uma mesma API para acessar diferentes bancos de dados. Ou seja, o mesmo código que escrevemos para lidar com
tabelas funcionará no MySQL, Postgres, MariaDB, etc.

__Abstração de gerenciamento de conexões__

Drivers de banco de dados são o mecanismo pelo qual conectamos uma aplicação à um banco de dados. Estes drivers/bancos funcionam baseados em
conexões e geralmente é uma boa ideia tomar cuidado com a quantidade de conexões que nossa(s) aplicação(ões) está criando e destruindo.
Criar um mecanismo para fazer este gerenciamento pode ser algo muito complexo, por isso, usamos ORMs para nos ajudarem nesta tarefa.

__Abstração de criação de queries complexas__

Conforme nossas regras de negócio crescem, crescem num mesmo ritmo a complexidade das consultas SQL que precisamos fazer num banco para
buscar, alterar e criar informações do nosso sistema. Escrever Strings gigantescas de consultas pode tornar um sistema bastante difícil de
manter, por isso, ORMs geralmente oferecem uma forma de construir estas consultas de maneira dinâmica usando APIs fluentes e concisas.

### Como usar

Vamos imaginar o seguinte cenário:

> Estamos em um time responsável por criar um sistema de cadastro de pessoas para o __Banco RoubaFacil__. O sistema será utilizado por
> gerentes do banco para obter os dados iniciais de novos clientes em potencial de um seguro de vida.

Depois de algumas conversas, modelamos a primeira tabela do sistema com as informações mais relevantes sobre nossos clientes:

```
+-----------------------+
|        Pessoa         |
+-----------------------+
|id: uuid primary key   |
|nome: varchar(200)     |
|idade: int             |
|peso: float            |
+-----------------------+
```

Para dar vida ao cadastro de pessoas, temos duas opções:

- Configurar um cliente de Postgres nas máquinas da galera gerente e ensiná-las a utilizar SQL
- Construir uma aplicação web amigável que forneça uma interface simples e prática para efetuar novos cadastros

Se decidiu pela segunda opção e, por isso, nossa missão agora é criar uma aplição que se conecte à um banco e resolva o problema da
gerência.

__Ligando as pontas__

À partir deste momento, o time começa a pensar em como ligar as duas pontas.

Vamos começar pelo banco de dados. Sabemos que é preciso SQL para manipular registros de uma tabela, portanto, sabemos que se pode, por
exemplo:

Criar novas linhas:

```sql
INSERT INTO Pessoa (nome, idade, peso) VALUES ("Silva", 30, 73.3);
```

Deletar linhas existentes:

```sql
DELETE FROM Pessoa WHERE id = 1;
```

Sabemos que, para executar esse código SQL, precisamos de um cliente SQL que se conecte à um banco de dados e nos permite enviar esses
comandos para o banco em questão. A pergunta agora é:

> Como fazer um programa que consiga se conectar ao banco e consiga executar o SQL que precisamos para cadastrar pessoas?

__Os Drivers SQL__

Depois de pesquisar um tempo, nosso time concluiu que era necessário um driver de conexão ao Postgres para fazer isso. Encontramos o módulo
[pg](https://www.npmjs.com/package/pg) que serve exatamente como um driver de conexão ao Postgres.

Fizemos um projeto para testar este módulo, este projeto está na pasta `com-driver`.

Apesar de o módulo `pg` ter sido muito bem desenvolvido, ele ainda assim foi desenhado para ser bastante genérico e abranger o maior número
de casos de uso possíveis. Essa generalização acaba se tornando um problema para a produtividade do nosso time, pois somente precisamos
manipular tabelas no banco de forma direta e rápida, não precisamos de tantos outros recursos. Ao utilizar um driver diretamente, é de se
notar, por exemplo, que:

- Se torna necessário escrever várias consultas manualmente com strings gigantes
- Temos que fazer uma quantidade imensa de código repetitivo somente para acessar o resultado de uma consulta
- A execução de consulta traz informações desnecessárias para nossa aplicação

__O Sequelize__

Foi então decidido investigar o Sequelize, um ORM que pode ajudar a resolver este tipo de problema.

