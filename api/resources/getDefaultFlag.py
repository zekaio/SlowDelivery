# -*- coding: utf-8 -*-
from flask import jsonify
from flask_restful import Resource
from common.database import database
from common.utils import checkSubscribe, checkLogin,checkTime


class getDefaultFlag(Resource):
    def get(self):
        checkTime()
        openId = checkLogin()
        # checkSubscribe(openId)
        obj = database()
        arr = obj.getDefaultFlag(openId)
        return jsonify({
            "flags": arr
        })
