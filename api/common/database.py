from api.config.config import cfg
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
    tel = Column(String(16), nullable=False)


class Flags(Base):
    __tablename__ = 'flags'
    id = Column(Integer, primary_key=True, autoincrement=True)
    open_id = Column(Text, nullable=False)
    # name = Column(String(16), nullable=False)
    # tel = Column(String(16), nullable=False)
    flag = Column(Text, nullable=False)


class TimeCapsule(Base):
    __tablename__ = 'timeCapsule'
    id = Column(Integer, primary_key=True, autoincrement=True)
    open_id = Column(Text, nullable=False)
    # name = Column(String(16), nullable=False)
    # tel = Column(String(16), nullable=False)
    type = Column(String(8), nullable=False)
    message = Column(Text, nullable=True)
    file_id = Column(Text, nullable=True)
    time = Column(Integer, nullable=False)


class OfflineCapsule(Base):
    __tablename__ = 'offlineCapsule'
    id = Column(Integer, primary_key=True, autoincrement=True)
    sender_name = Column(Text, nullable=False)
    sender_tel = Column(String(16), nullable=False)
    receiver_name = Column(Text, nullable=False)
    receiver_tel = Column(String(16), nullable=False)
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
        data = self.getInfo(open_id)
        if not data:
            return False
        else:
            # name = data[0]
            # tel = data[1]
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

    # 保存信件
    def sendTimeCapsule(self, open_id, msgtype, message, time):
        data = self.getInfo(open_id)
        if not data:
            return False
        else:
            if msgtype == "voice":
                self.session.add(TimeCapsule(open_id=open_id, type=msgtype, file_id=message, time=time))
            else:
                self.session.add(TimeCapsule(open_id=open_id, type=msgtype, message=message, time=time))
            self.session.commit()
            self.session.close()
            return True

    # 线下寄信
    def sendOfflineCapsule(self, sender_name, sender_tel, receiver_name, receiver_tel, receiver_addr, capsule_tag,
                           time):
        self.session.add(OfflineCapsule(sender_name=sender_name, sender_tel=sender_tel, receiver_addr=receiver_addr,
                                        receiver_name=receiver_name, receiver_tel=receiver_tel, capsule_tag=capsule_tag,
                                        time=time))
        self.session.commit()
        self.session.close()
        return True

    # 获取默认flag
    def getDefaultFlag(self):
        query = (self.session
                 .query(DefaultFlag)
                 .all()
                 )
        arr = []
        for flag in query:
            arr.append(flag.flag)
        return arr
