# -*- coding: utf-8 -*-
from config.config import cfg
from sqlalchemy import create_engine, Column, Integer, String, Text, LargeBinary, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from flask_restful import abort
from flask import session
import random
import time

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
    __table_args__ = {
        'mysql_charset': 'utf8mb4'
    }


class Flags(Base):
    __tablename__ = 'flags'
    id = Column(Integer, primary_key=True, autoincrement=True)
    open_id = Column(Text, nullable=False)
    name = Column(Text, nullable=False)
    flag = Column(LargeBinary, nullable=False)
    __table_args__ = {
        'mysql_charset': 'utf8mb4'
    }

class TimeCapsule(Base):
    __tablename__ = 'timecapsule'
    id = Column(Integer, primary_key=True, autoincrement=True)
    open_id = Column(Text, nullable=False)
    type = Column(String(8), nullable=False)
    message = Column(Text, nullable=True)
    file_id = Column(Text, nullable=True)
    time = Column(Integer, nullable=False)
    send_offline = Column(Boolean, nullable=True, default=False)
    address = Column(Text, nullable=True)
    tel = Column(String(11), nullable=True)
    __table_args__ = {
        'mysql_charset': 'utf8mb4'
    }

class OfflineCapsule(Base):
    __tablename__ = 'offlinecapsule'
    id = Column(Integer, primary_key=True, autoincrement=True)
    sender_name = Column(Text, nullable=True)
    sender_tel = Column(String(11), nullable=True)
    receiver_name = Column(Text, nullable=True)
    receiver_tel = Column(String(11), nullable=True)
    receiver_addr = Column(Text, nullable=True)
    capsule_tag = Column(String(cfg["length"]), nullable=False, unique=True)
    time = Column(Integer, nullable=True)
    __table_args__ = {
        'mysql_charset': 'utf8mb4'
    }

class DefaultFlag(Base):
    __tablename__ = 'defaultflag'
    id = Column(Integer, primary_key=True, autoincrement=True)
    flag = Column(Text, nullable=False)
    __table_args__ = {
        'mysql_charset': 'utf8mb4'
    }

class database(object):
    def __init__(self):
        self.__Session_class = sessionmaker(bind=engine)

    # 获取用户信息
    def getInfo(self, open_id):
        Session = self.__Session_class()
        try:
            query = (Session
                     .query(Users)
                     .filter(Users.open_id == open_id)
                     .first()
                     )
        except Exception as e:
            abort(408, message=str(e))
            return False
        Session.close()
        if not query:
            return False
        else:
            return {"name": query.name, "tel": query.tel}

    # 保存用户信息
    def updateInfo(self, open_id, name, tel):
        Session = self.__Session_class()
        Session.add(Users(open_id=open_id, name=name, tel=tel))
        try:
            Session.commit()
        except Exception as e:
            abort(408, message=str(e))
        Session.close()
        return True

    # 保存flag
    def sendFlag(self, open_id, flag):
        data = self.getInfo(open_id)
        if not data:
            return False
        else:
            Session = self.__Session_class()
            query = (Session
                     .query(Users)
                     .filter(Users.open_id == open_id)
                     .first()
                     )
            query.check_flag = True
            Session.add(Flags(open_id=open_id, name=data['name'], flag=flag))
            try:
                Session.commit()
            except Exception as e:
                abort(408, message=str(e))
            Session.close()
            return True

    # 获取flag
    def getFlag(self, open_id):
        data = self.getInfo(open_id)
        if not data:
            abort(404, message="请先填写姓名和手机号")
        else:
            Session = self.__Session_class()
            try:
                query = (Session
                         .query(Flags)
                         .filter(Flags.open_id == open_id)
                         .first()
                         )
            except Exception as e:
                abort(408, message=str(e))
                return False
            Session.close()
            if not query:
                return False
            else:
                return query.flag

    # 保存信件
    def sendTimeCapsule(self, open_id, msgtype, message, Time, send_offline=False, address=None):
        data = self.getInfo(open_id)
        if not data:
            abort(405, message="请先填写信息。")
            return False
        else:
            tel = data['tel']
            Session = self.__Session_class()
            try:
                query = (Session
                         .query(Users)
                         .filter(Users.open_id == open_id)
                         .first()
                         )
            except Exception as e:
                abort(408, message=str(e))
                return False
            if msgtype == "voice":
                Session.add(
                    TimeCapsule(open_id=open_id, type=msgtype, file_id=message, time=Time, send_offline=send_offline,
                                address=address, tel=tel))
                query.check_voice = True
            else:
                Session.add(
                    TimeCapsule(open_id=open_id, type=msgtype, message=message, time=Time, send_offline=send_offline,
                                address=address, tel=tel))
                query.check_text = True
            try:
                Session.commit()
            except Exception as e:
                abort(408, message=str(e))
            Session.close()
            return True

    # 线下寄信
    def sendOfflineCapsule(self, sender_name, sender_tel, receiver_name, receiver_tel, receiver_addr, capsule_tag,
                           Time):
        Session = self.__Session_class()
        try:
            query = (Session
                     .query(OfflineCapsule)
                     .filter(OfflineCapsule.capsule_tag == capsule_tag.lower())
                     .first()
                     )
        except Exception as e:
            abort(408, message=str(e))
            return False
        if query is None:
            abort(404, message="取信码无效")
            return False
        elif query.sender_name is not None:
            abort(409, message="取信码已被使用")
            return False
        else:
            query.sender_name = sender_name
            query.sender_tel = sender_tel
            query.receiver_name = receiver_name
            query.receiver_tel = receiver_tel
            query.receiver_addr = receiver_addr
            query.time = Time
            try:
                Session.commit()
            except Exception as e:
                abort(408, message=str(e))
            Session.close()
            return True

    # 获取默认flag
    def getDefaultFlag(self, open_id):
        data = self.getInfo(open_id)
        if not data:
            abort(405, message="请先填写信息。")
            return False
        if "defaultFlag" not in session:
            Session = self.__Session_class()
            try:
                query = (Session
                         .query(DefaultFlag)
                         .all()
                         )
            except Exception as e:
                abort(408, message=str(e))
                return False
            arr = []
            for flag in query:
                arr.append(flag.flag)
            Session.close()
            session['defaultFlag'] = arr
        random.seed(time.time())
        return random.sample(session['defaultFlag'], 6)

    # 判断是否填写时光胶囊
    def checkTimeCapsule(self, open_id):
        Session = self.__Session_class()
        try:
            query = (Session
                     .query(Users)
                     .filter(Users.open_id == open_id)
                     .first()
                     )
        except Exception as e:
            abort(408, message=str(e))
            return False
        return {"check_text": query.check_text, "check_voice": query.check_voice}

    # 判断是否填写flag
    def checkFlag(self, open_id):
        Session = self.__Session_class()
        try:
            query = (Session
                     .query(Users)
                     .filter(Users.open_id == open_id)
                     .first()
                     )
        except Exception as e:
            abort(408, message=str(e))
            return False
        return query.check_flag

    def getTime(self, open_id):
        Session = self.__Session_class()
        try:
            query = (Session
                     .query(TimeCapsule)
                     .filter(TimeCapsule.open_id == open_id)
                     .first()
                     )
        except Exception as e:
            abort(408, message=str(e))
            return False
        Session.close()
        return query.time
