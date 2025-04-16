- For the local development, you don't need to setup anything.

- By default, all the branches are pointing to the dev-server. And make sure not to modify the production folder.

  /config
  /development
  register-config.json

- If you want to point to local backend server, change the endpoint property to whatever the server your local backend is running.

  for example:
  "endpoint": "http://localhost:3000"

**MAKE SURE TO CHANGE IT BACK TO DEV-SERVER WHEN YOU PUSH IT TO REMOTE**
