# 演讲计时器

一个优雅的演讲计时器，帮助演讲者精确控制演讲时间，通过直观的颜色变化和可选的语音提示，让演讲时间管理变得简单而专业。

## 功能特点

- 精确的时间控制
- 直观的颜色提示（正常、警告、危险时间）
- 全屏显示模式
- 声音提示选项
- 移动端屏幕常亮
- 响应式设计

## 本地开发

1. 克隆仓库
2. 使用 Python 启动本地服务器：
```bash
python -m http.server 8000
```
3. 访问 http://localhost:8000

## 服务器部署

### 1. 安装 Nginx
```bash
sudo apt update
sudo apt install nginx
```

### 2. 配置 Nginx

1. 创建网站配置文件：
```bash
sudo touch /etc/nginx/sites-available/speechtimer
```

2. 编辑配置文件，添加以下内容：
```nginx
server {
    listen 80;
    listen [::]:80;
    server_name your-ip-address;
    
    # 将 HTTP 重定向到 HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    listen [::]:443 ssl;
    server_name your-ip-address;

    # SSL 证书配置
    ssl_certificate /etc/ssl/certs/nginx-selfsigned.crt;
    ssl_certificate_key /etc/ssl/private/nginx-selfsigned.key;
    
    # SSL 配置优化
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    
    # HSTS 配置
    add_header Strict-Transport-Security "max-age=63072000" always;
    
    root /var/www/timer;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # 启用 gzip 压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    
    # 缓存静态文件
    location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
        expires 1d;
        add_header Cache-Control "public, no-transform";
    }
    
    # 安全相关头部
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
}
```

3. 创建符号链接：
```bash
sudo ln -s /etc/nginx/sites-available/speechtimer /etc/nginx/sites-enabled/
```

### 3. 生成 SSL 证书

生成自签名证书：
```bash
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
-keyout /etc/ssl/private/nginx-selfsigned.key \
-out /etc/ssl/certs/nginx-selfsigned.crt
```

### 4. 部署网站文件

1. 创建网站目录：
```bash
sudo mkdir -p /var/www/timer
```

2. 复制网站文件：
```bash
sudo cp -r * /var/www/timer/
```

3. 设置目录权限：
```bash
sudo chown -R www-data:www-data /var/www/timer
sudo chmod -R 755 /var/www/timer
```

### 5. 启动 Nginx

1. 测试配置：
```bash
sudo nginx -t
```

2. 如果测试通过，重启 Nginx：
```bash
sudo systemctl restart nginx
```

### 6. 访问网站

使用浏览器访问：
```
https://your-ip-address
```

注意：由于使用自签名证书，浏览器会显示安全警告，需要手动接受证书风险。

## 故障排除

如果网站无法访问，请检查：

1. Nginx 服务状态：
```bash
sudo systemctl status nginx
```

2. 网站文件权限：
```bash
ls -l /var/www/timer
```

3. 防火墙设置：
```bash
sudo ufw status
```

4. Nginx 错误日志：
```bash
sudo tail -f /var/log/nginx/error.log
``` 