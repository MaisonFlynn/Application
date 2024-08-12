[![Application](https://img.youtube.com/vi/YCA2Qj8-l-0/maxresdefault.jpg)](https://www.youtube.com/watch?v=YCA2Qj8-l-0)

```bash
git clone https://github.com/MaisonFlynn/Application.git
cd Application/Server
npm install
touch .env
```

`.env`

```
CONNECT= MongoDB Connection String
SECRET= JWT Secret Key
USER= Gmail Address
PASS= Gmail Password || App Password
PORT= Default 3000
```

```bash
npm run dev
```