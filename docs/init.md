### 初始化

#### 配置文件

文件路径：api/config/config.py

secret_key：

```
>>> import os
>>> os.urandom(12).hex()
```

#### nginx配置

```
location /folder_name/api/ {
	proxy_pass http://127.0.0.1:port/;
}
```

#### 数据库配置

```
python init_database.py
```

