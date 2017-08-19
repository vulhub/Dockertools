# 蚁逅

## 安装

### 0x01 基础环境

安装certbot

```
apt-get update
apt-get install software-properties-common
add-apt-repository ppa:certbot/certbot
apt-get update
apt-get install certbot 
```

生成证书

```
certbot certonly --standalone -d example.com -d www.example.com --agree-tos
```

生成好的证书在 /etc/letsencrypt/live/example.com 位置。



### 0x02 修改环境变量

```
cp .env.default .env
vim .env
```

### 0x02 修改Nginx配置

```
vim volumes/nginx/conf.d/ant.conf
```

将server_name改成你的域名。

### 0x02 运行

pass