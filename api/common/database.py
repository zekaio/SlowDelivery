from config.config import cfg
from sqlalchemy import create_engine, Column, Integer, String, Text, LargeBinary
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from flask_restful import abort

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
    name = Column(String(16), nullable=False)
    # tel = Column(String(16), nullable=False)
    flag = Column(LargeBinary, nullable=False)


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
    sender_name = Column(Text, nullable=True)
    sender_tel = Column(String(16), nullable=True)
    receiver_name = Column(Text, nullable=True)
    receiver_tel = Column(String(16), nullable=True)
    receiver_addr = Column(Text, nullable=True)
    capsule_tag = Column(Text, nullable=False, unique=True)
    time = Column(Integer, nullable=True)


class DefaultFlag(Base):
    __tablename__ = 'defaultFlag'
    id = Column(Integer, primary_key=True, autoincrement=True)
    flag = Column(Text, nullable=False)


class database(object):
    def __init__(self):
        self.__Session_class = sessionmaker(bind=engine)

    # 获取用户信息
    def getInfo(self, open_id):
        session = self.__Session_class()
        query = (session
                 .query(Users)
                 # .filter_by(open_id=open_id)
                 .filter(Users.open_id == open_id)
                 .first()
                 )
        session.close()
        if not query:
            return False
        else:
            return [query.name, query.tel]

    # 保存用户信息
    def updateInfo(self, open_id, name, tel):
        session = self.__Session_class()
        session.add(Users(open_id=open_id, name=name, tel=tel))
        session.commit()
        session.close()
        return True

    # 保存flag
    def sendFlag(self, open_id, name, flag):
        data = self.getInfo(open_id)
        if not data:
            return False
        else:
            session = self.__Session_class()
            session.add(Flags(open_id=open_id, name=name, flag=flag))
            session.commit()
            session.close()
            return True

    # 获取flag
    def getFlag(self, open_id):
        session = self.__Session_class()
        query = (session
                 .query(Flags)
                 .filter(Flags.open_id == open_id)
                 .first()
                 )
        session.close()
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
            session = self.__Session_class()
            if msgtype == "voice":
                session.add(TimeCapsule(open_id=open_id, type=msgtype, file_id=message, time=time))
            else:
                session.add(TimeCapsule(open_id=open_id, type=msgtype, message=message, time=time))
            session.commit()
            session.close()
            return True

    # 线下寄信
    def sendOfflineCapsule(self, sender_name, sender_tel, receiver_name, receiver_tel, receiver_addr, capsule_tag,
                           time):
        session = self.__Session_class()
        query = (session
                 .query(OfflineCapsule)
                 .filter(OfflineCapsule.capsule_tag == capsule_tag.lower())
                 .first()
                 )
        if query is None:
            abort(404, message="Invaild capsule tag")
            return False
        elif query.sender_name is not None:
            abort(409, message="Capsule tag has been used")
            return False
        else:
            query.sender_name = sender_name
            query.sender_tel = sender_tel
            query.receiver_name = receiver_name
            query.receiver_tel = receiver_tel
            query.receiver_addr = receiver_addr
            query.time = time
            session.commit()
            session.close()
            return True

    # 获取默认flag
    def getDefaultFlag(self):
        session = self.__Session_class()
        query = (session
                 .query(DefaultFlag)
                 .all()
                 )
        arr = []
        for flag in query:
            arr.append(flag.flag)
        session.close()
        return arr
