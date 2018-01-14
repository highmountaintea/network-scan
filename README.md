Scans network or subnet for open ports

# Description

I forgot the IP addresses of some of my WiFi routers, so I created this tool to find them. This is intended to be a very simple tool to scan the subnet for HTTP/FTP ports etc.

The tool is deliberately simple to avoid being used for hacking purposes.

# Usage

First `npm install -g network-scan`, then you can run it in terminal or command prompt

```
network-scan -n 192.168.100.1-192.168.100.254 ports=http,https,ftp,6379
```
