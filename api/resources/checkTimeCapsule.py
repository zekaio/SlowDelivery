# -*- coding: utf-8 -*-
from flask import jsonify
from flask_restful import Resource,abort
from common.database import database
from common.utils import checkSubscribe, checkLogin


class checkTimeCapsule(Resource):
    def get(self):
        openId = checkLogin()
        checkSubscribe(openId)
        obj = database()
        if not obj.getInfo(openId):
            abort(404, message="请先填写信息")
        check = obj.checkTimeCapsule(openId)
        return jsonify({
            "check_text": check['check_text'],
            "check_voice": check['check_voice']
        })
