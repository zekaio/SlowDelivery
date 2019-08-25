### users

| id      | int  |           |
| ------- | ---- | --------- |
| open_id | text |           |
| name    | text | 姓名/昵称 |
| tel     | text | 手机号    |

### flags

| id      | int  |      |
| ------- | ---- | ---- |
| open_id | text |      |
| flag    | text |      |
|         |      |      |

### timeCapsule

| id      | int  |          |
| ------- | ---- | -------- |
| open_id | text |          |
| message | text | null     |
| file_id | text | null     |
| time    | text | 毕业时间 |
|         |      |          |

### offlineCapsule

| id            | int  |            |
| ------------- | ---- | ---------- |
| sender_name   | text | 寄信人名字 |
| sender_tel    | text | 寄信人电话 |
| receiver_name | text | 收信人名字 |
| receiver_tel  | text | 收信人电话 |
| receiver_addr | text | 收信人地址 |
| capsule_tag   | text | 取信码     |
| time          | text | 毕业时间   |
|               |      |            |

### defaultFlag

| id   | int  |      |
| ---- | ---- | ---- |
| flag | text |      |
|      |      |      |
|      |      |      |

