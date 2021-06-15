# Mikanai Interview Exercise

## Instructions

The exercise is to be delivered by the 21st of June via a private repository on Github to be shared with [Matteo Joliveau](https://github.com/MatteoJoliveau) (if necessary, we will also give you other people to share it with).
If there are parts that you will not perform, detail the reasons that blocked you (for example, I did not have enough time, I encountered this difficulty) and how you thought of solving them.
The aim is to make yourself known as a developer, so even if you don't finish the entire test, don't worry.

Give me confirmation of receipt of this email.
For any doubt, do not hesitate to contact us.

Happy coding! :)

## Simple Microservices (Node)

The objective is to write a simple microservice oriented backend, which exposes a web API that allows to manage some simple entities.

The attributes of our application entities are:

- Category

  - name: string
  - postCount: number
  - productCount: number

- Post

  - title: string
  - body: string
  - category: Category

- Product

  - Name: string
  - Price: number
  - category: Category

This means that the same category can be assigned to both posts and products.

The fun part is that each entity must be managed by a separated microservice - and each microservice should manage its own separated database.

Each microservice must implement a simple public facing CRUD interface. For the read part no pagination is required, we just need to be able to get an item by id, and get the list of all items.
(an external API gateway is not required)

When updating a post or a product, the user can specify a category id, which must correspond to an existing category. If no category is matched by the provided id, an error must be returned to the caller.

The category microservice must keep track of how many posts and products have been assigned to a single category (with the postCount and productCount attributes). Keep in mind that a category can be removed only when there are no posts or products assigned to it.

Automated tests are also expected to be provided.

You are free to use whatever framework / database system / message broker / api paradigm / static analysis tool / whatever - you deem the best for the task

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/)

- [Docker Compose](https://docs.docker.com/compose/install/#install-compose)

## First run

```bash
# create env file from example
$ mv .env-dist .env

# execute docker
$ docker-compose -f docker-compose.yml up -d

# run migrations to create database and populate it
$ docker exec -it mikamai-interview-exercise_services_1 typeorm migration:run
```

## Run

```bash
# development
$ docker-compose up

# production
$ docker-compose -f docker-compose.yml up -d
```

## Author

[Nico Dante](mailto:info@nicodante.it)

## License

[MIT License](LICENSE).
