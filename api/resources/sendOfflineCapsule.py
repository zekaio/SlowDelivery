# -*- coding: utf-8 -*-
from flask import jsonify, request, abort
from flask_restful import Resource
from common.database import database
from common.utils import checkTel
from common.utils import checkSubscribe, checkLogin,checkTime


class sendOfflineCapsule(Resource):
    def post(self):
        checkTime()
        openId = checkLogin()
        checkSubscribe(openId)
        data = request.get_json(force=True)
        if checkTel(data['sender_tel']) and checkTel(data['receiver_tel']):
            obj = database()
            if obj.sendOfflineCapsule(data['sender_name'], data['sender_tel'], data['receiver_name'],
                                      data['receiver_tel'], data['receiver_addr'], data['capsule_tag'], data['time']):
                return jsonify({
                    "errcode": 0
                })
        else:
            abort(400, message="手机号错误。")
