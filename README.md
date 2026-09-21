# aria2web

A container featuring `aria2` and a minimal web interface built with HTML, CSS (BulmaCSS), and JavaScript. No frameworks or build steps required. A lightweight alternative to AriaNg.

## 🎨 Resources

* Add downloads via URL or magnet link.
* List status, progress, size, and speed.
* Pause, resume, and remove.
* Select the destination folder from mounted folders.
* Remove from the list only or also delete the file from the disk.

## 🚀 Usage

```bash
docker container run -d --name aria2web \
  -p 8080:8080 -p 6800:6800 \
  -e RPC_SECRET=change-for-your-secret \
  -v $PWD/downloads:/downloads:Z \
  aria2web
```

Or download the [docker-compose](https://raw.githubusercontent.com/ciro-mota/aria2web/refs/heads/main/docker-compose.yml) file and run `docker compose up -d`.

Open `http://localhost:8080` and enter the `RPC_SECRET` value as the token.

To provide other destination folders, mount each one inside `/downloads`. Example:

```
-v /mnt/hd2/isos:/downloads/isos
```

## 🔧 Configuration

| Item | Description |
|---|---|
| `RPC_SECRET` | Token for aria2 and the web page. Use letters, numbers, and `. _ ~ -`, up to 128 characters |
| Port 8080 | Web page |
| Port 6800 | aria2 RPC. Expose as `6800:6800`, as the web page connects to it |
| `/downloads` | Default destination folder |

## 📋 Notes

* The `:Z` suffix is ​​required on hosts with SELinux, such as Fedora. Remove it on other hosts.
* The list of folders is generated when the container starts. Restart the container after changing the mounts.
* The page does not use TLS, and the token is transmitted via HTTP. Use it on a local network or behind a VPN.
* Bulma CSS is loaded via the jsDelivr CDN.
* The page files are included in the image. If a change does not appear, rebuild using `--no-cache`.