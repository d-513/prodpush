const fs = require("fs-extra");
const path = require("path");
const express = require("express");
const cp = require("child_process");
const { promisify } = require("util");
const exec = promisify(cp.exec);

console.log("ProdPush Server Starting...");
(async () => {
  const configPath = path.join(process.cwd(), "config.json");
  const config = await fs.readJSON(configPath).catch(async (_) => {
    console.log(
      "No config file found, creating config.json and then exiting..."
    );
    const defaultConfig = await fs.readFile(
      path.join(__dirname, "default/config.json")
    );
    await fs.writeFile(configPath, defaultConfig);
    process.exit(2);
  });

  const app = express();

  app.get("/t/:key", async (req, res) => {
    if (!req.params.key) return res.sendStatus(500);
    const script = config.scripts.find(
      (script) => script.key === req.params.key
    );
    if (!script) {
      console.log(
        `WARNING: Got invalid key request for ${req.params.key} from IP ${req.ip}`
      );
      return res.sendStatus(403);
    }
    console.log(`Executing key ${script.key}`);
    if (config.return_script_output) {
      const out = await exec(script.command);
      return res.json({
        stdout: out.stdout,
        stderr: out.stderr,
      });
    } else {
      exec(script.command);
      return res.sendStatus(200);
    }
  });

  app.listen(config.port, () => console.log(`Listening on ${config.port}`));
})();
