# -*- coding: utf-8 -*-
from flask import jsonify, request
from flask_restful import Resource, abort
from common.database import database
from common.utils import checkTel
from common.utils import checkSubscribe, checkLogin,checkTime


class updateInfo(Resource):
    def post(self):
        checkTime()
        openId = checkLogin()
        checkSubscribe(openId)
        obj = database()
        info = obj.getInfo(openId)
        if info:
            abort(409, message="已经填写过信息了。")
        else:
            data = request.get_json(force=True)
            if checkTel(data['tel']):
                obj.updateInfo(openId, data['name'], data['tel'])
                return jsonify({
                    "errcode": 0,
                    "errmsg": ""
                })
            else:
                abort(400, message="手机号无效。")
