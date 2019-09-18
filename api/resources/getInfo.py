# -*- coding: utf-8 -*-
from flask import jsonify
from flask_restful import Resource
from common.database import database
from common.utils import checkSubscribe, checkLogin


class getInfo(Resource):
    def get(self):
        openId = checkLogin()
        checkSubscribe(openId)
        obj = database()
        info = obj.getInfo(openId)
        if info:
            check = obj.checkTimeCapsule(openId)
            return jsonify({
                "record": True,
                "name": info['name'],
                "tel": info['tel'],
                "check_flag": obj.checkFlag(openId),
                "check_text": check['check_text'],
                "check_voice": check['check_voice']
            })
        else:
            return jsonify({
                "record": False
            })
