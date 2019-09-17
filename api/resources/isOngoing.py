# -*- coding: utf-8 -*-
from flask_restful import Resource
from flask import jsonify
import datetime
import time
from config.config import cfg


class isOngoing(Resource):
    def get(self):
        begin = datetime.datetime.strptime(cfg["begin"], '%Y-%m-%d %H:%M:%S')
        end = datetime.datetime.strptime(cfg["end"], '%Y-%m-%d %H:%M:%S')
        now = datetime.datetime.strptime(time.strftime("%Y-%m-%d %H:%M:%S", time.localtime()), '%Y-%m-%d %H:%M:%S')
        if now < begin:
            return jsonify({
                "status": -1
            })
        elif now > end:
            return jsonify({
                "status": 1
            })
        else:
            return jsonify({
                "status": 0
            })
