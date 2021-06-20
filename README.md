# prodpush

Tiny webserver to run a command on request very easily (for example to update production from CI)

### Download

Use

```bash
curl -s https://api.github.com/repos/dada513/prodpush/releases/latest \
  | grep browser_download_url \
  | grep prodpush \
  | cut -d '"' -f 4 \
  | wget -qi -

sudo chmod +x prodpush
```

in bash to get the latest release of prodpush.  
You can run it with: `./prodpush`.  
After first start, it will generate a config file you can then edit.

### Run as daemon

Assuming you downloaded prodpush to `/opt/prodpush` folder, and the executable is named `server`:

`sudo nano /etc/systemd/system/prodpush.service`

```s
[Unit]
Description=Prodpush deploy server

[Service]
Type=simple
ExecStart=/opt/prodpush/server

[Install]
WantedBy=multi-user.target
```

you can also use pm2 if you have it installed: `pm2 start --name prodpush /path/to/prodpush`

### Configuration

the configuration is located at `/path/to/prodpush/config.json` and is generated at the first launch of the executable:

```jsonc
{
  // note: dont copy comments
  // the port the webserver will listen on
  "port": 9000,
  // whether the webserver should return the output of the scripts after they are executed (true) or respond as soon as it launches the script without meaningful output (false). In most cases false is ok unless you want your CI to catch deploy errors, which needs additional setup
  "return_script_output": false,
  // the scripts to run
  "scripts": [
    {
      // the secret key to be able to run this script, never share with untrusted pepole (or they can overload your server and cause too many restarts)
      // to generate I recommend running uuidgen on Linux
      "key": "KEEP_THIS_SECRET",
      // the command that will be ran upon http request
      "command": "bash deploy.sh"
    }
  ]
}
```

### Example Usage

Do this in your CI or whenever you want to force a deployment.  
Example curl deploy for key `KEEP_THIS_SECRET`:

```bash
curl http://localhost:9000/t/KEEP_THIS_SECRET
```

### API

Only endpoint is `/t/script_key`. It will execute the bash script defined in config.
