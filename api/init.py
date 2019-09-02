from config.config import cfg
from sqlalchemy import create_engine, Column, Integer, String, Text, LargeBinary,Boolean
from sqlalchemy.ext.declarative import declarative_base
import string
import random
import mysql.connector

# 创建数据库
engine = create_engine("mysql+pymysql://" + cfg["username"] + ":" + cfg["password"] + "@" + cfg["host"] + "/" + cfg[
    "database"] + "?charset=utf8mb4")
Base = declarative_base()


class Users(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, autoincrement=True)
    open_id = Column(Text, nullable=False)
    name = Column(Text, nullable=False)
    tel = Column(String(11), nullable=False)
    check_text = Column(Boolean, default=False)
    check_voice = Column(Boolean, default=False)
    check_flag = Column(Boolean, default=False)

class Flags(Base):
    __tablename__ = 'flags'
    id = Column(Integer, primary_key=True, autoincrement=True)
    open_id = Column(Text, nullable=False)
    name = Column(Text, nullable=False)
    flag = Column(LargeBinary, nullable=False)


class TimeCapsule(Base):
    __tablename__ = 'timeCapsule'
    id = Column(Integer, primary_key=True, autoincrement=True)
    open_id = Column(Text, nullable=False)
    type = Column(String(8), nullable=False)
    message = Column(Text, nullable=True)
    file_id = Column(Text, nullable=True)
    time = Column(Integer, nullable=False)


class OfflineCapsule(Base):
    __tablename__ = 'offlineCapsule'
    id = Column(Integer, primary_key=True, autoincrement=True)
    sender_name = Column(Text, nullable=True)
    sender_tel = Column(String(11), nullable=True)
    receiver_name = Column(Text, nullable=True)
    receiver_tel = Column(String(11), nullable=True)
    receiver_addr = Column(Text, nullable=True)
    capsule_tag = Column(Text, nullable=False, unique=True)
    time = Column(Integer, nullable=True)


class DefaultFlag(Base):
    __tablename__ = 'defaultFlag'
    id = Column(Integer, primary_key=True, autoincrement=True)
    flag = Column(Text, nullable=False)


Base.metadata.create_all(engine)

# 插入取信码
chars = string.ascii_lowercase + string.digits
num = 1000  # 要插入的取信码的数量
length = 4  # 取信码位数
conn = mysql.connector.connect(user=cfg['username'], password=cfg['password'], database=cfg['database'])
cursor = conn.cursor()
file = open("capsule_tag.txt", "a")
while num:
    randomTag = ''.join(random.sample(chars, length))
    try:
        cursor.execute('insert into `offlineCapsule` (`capsule_tag`) values (%s)', [randomTag])
        conn.commit()
        num -= 1
        file.writelines([randomTag, "\n"])
    except:
        continue

cursor.close()
conn.close()
file.close()
print("done.")
