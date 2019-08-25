from config.config import cfg
import sqlalchemy
from sqlalchemy import create_engine, Column, Integer, String, Table, MetaData

engine = create_engine("mysql+pymysql://" + cfg["username"] + ":" + cfg["password"] + "@" + cfg["host"] + "/" + cfg[
    "database"] + "?charset=utf8mb4")
