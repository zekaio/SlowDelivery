# -*- coding: utf-8 -*-
from flask import jsonify, request
from flask_restful import Resource, abort
import pickle
from common.database import database
from common.utils import checkSubscribe, checkLogin,checkTime


class sendFlag(Resource):
    def post(self):
        checkTime()
        openId = checkLogin()
        # checkSubscribe(openId)
        obj = database()
        if not obj.getInfo(openId):
            abort(404, message="请先填写信息")
        if obj.checkFlag(openId):
            abort(409, message="已经填写过flag")
        else:
            data = request.get_json(force=True)
            _flag = pickle.dumps(data['flag'])
            obj.sendFlag(openId, _flag)
            return jsonify({
                "errcode": 0
            })
