```sh
git clone https://github.com/MaisonFlynn/Application.git
cd Application/Server
npm i
touch .env
```

`.env`
```plaintext
CONNECTION = MongoDB Connection String
USER = Email
PASS = Email's Password
KEY = JWT Secret Key
PORT = Preferred Port, Default 3000
```
```sh
npm run start
```