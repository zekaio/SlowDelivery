from config.config import cfg
from sqlalchemy import create_engine, Column, Integer, String, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

engine = create_engine("mysql+pymysql://" + cfg["username"] + ":" + cfg["password"] + "@" + cfg["host"] + "/" + cfg[
    "database"] + "?charset=utf8mb4")
Base = declarative_base()


class Users(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, autoincrement=True)
    open_id = Column(Text, nullable=False)
    name = Column(String(16), nullable=False)
    tel = Column(String(11), nullable=False)


class Flags(Base):
    __tablename__ = 'flags'
    id = Column(Integer, primary_key=True, autoincrement=True)
    open_id = Column(Text, nullable=False)
    flag = Column(Text, nullable=False)


class TimeCapsule(Base):
    __tablename__ = 'timeCapsule'
    id = Column(Integer, primary_key=True, autoincrement=True)
    open_id = Column(Text, nullable=False)
    message = Column(Text, nullable=True)
    file_id = Column(Text, nullable=True)
    time = Column(Integer, nullable=False)


class OfflineCapsule(Base):
    __tablename__ = 'offlineCapsule'
    id = Column(Integer, primary_key=True, autoincrement=True)
    sender_name = Column(Text, nullable=False)
    sender_tel = Column(String(11), nullable=False)
    receiver_name = Column(Text, nullable=False)
    receiver_tel = Column(String(11), nullable=False)
    receiver_addr = Column(Text, nullable=False)
    capsule_tag = Column(Text, nullable=False)
    time = Column(Integer, nullable=False)


class DefaultFlag(Base):
    __tablename__ = 'defaultFlag'
    id = Column(Integer, primary_key=True, autoincrement=True)
    flag = Column(Text, nullable=False)


class database(object):
    def __init__(self):
        self.__Session_class = sessionmaker(bind=engine)
        self.session = self.__Session_class()

    # 获取用户信息
    def getInfo(self, open_id):
        query = (self.session
                 .query(Users)
                 .filter(Users.open_id == open_id)
                 .first()
                 )
        if not query:
            return False
        else:
            return [query.name, query.tel]

    # 保存用户信息
    def updateInfo(self, open_id, name, tel):
        self.session.add(Users(open_id=open_id, name=name, tel=tel))
        self.session.commit()
        self.session.close()
        return True

    # 保存flag
    def sendFlag(self, open_id, flag):
        self.session.add(Flags(open_id=open_id, flag=flag))
        self.session.commit()
        self.session.close()
        return True

    # 获取flag
    def getFlag(self, open_id):
        query = (self.session
                 .query(Flags)
                 .filter(Flags.open_id == open_id)
                 .first()
                 )
        if not query:
            return False
        else:
            return query.flag
    # # 保存信件
    # def sendTimeCapsule(self):
    #
    # # 线下寄信
    # def sendOfflineCapsule(self):
    #
    # # 判断活动是否结束
    # def isOngoing(self):
    #
    # # 获取默认flag
    # def getDefaultFlag(self):

# database.getInfo("222")
