##To Generate a migration File

> npm run migration:create ./src/migration/add_refreshtoken_cascade

##To Run Postgress Container

> docker mernPg db container run cmd
> docker run --rm --name mernpg-container -e POSTGRES_USER=root -e POSTGRES_PASSWORD=root -v mernpgdata:/var/lib/postgresql/data -p 5432:5432 -d postgres

##To Run Migration

> npm run migration:run -- -d ./src/config/data-source

##To Run Build File

> $env:NODE_ENV = "dev"; node .\src\server.js

### show existing docker images
> docker image ls
docker run --env-file .env.dev -e PRIVffATE_KfEY="-----BddEGINff RSA PRIVAfTE KEfY-----
Mh
-----ENDf RSAf PRIVAdddTE KEY-----" -p 5501:5501 mrahulroy/mernstack_auth_service:build-19