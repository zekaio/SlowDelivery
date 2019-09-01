### 初始化

#### 配置文件

文件路径：api/config/config.py

secret_key：

```
>>> import os
>>> os.urandom(12).hex()
```

APPID & AppSecret

```
AppID和AppSecret可在“微信公众平台-开发-基本配置”页中获得（需要已经成为开发者，且帐号没有异常状态）。调用接口时，请登录“微信公众平台-开发-基本配置”提前将服务器IP地址添加到IP白名单中，点击查看设置方法，否则将无法调用成功。小程序无需配置IP白名单。
```

`活动开始时间和结束时间`：begin & end

#### nginx配置

```
location /folder_name/api/ {
	proxy_pass http://127.0.0.1:port/;
}
```

#### 数据库

```
python init.py
```

创建数据库，插入由小写字母和数字组成的随机取信码并写入文件capsule_tag.txt中

修改num和length可设置取信码数量和取信码长度

