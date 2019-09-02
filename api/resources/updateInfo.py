from flask import jsonify, request
from flask_restful import Resource, abort
from common.database import database
from common.utils import checkTel
from common.utils import checkSubscribe, checkLogin


class updateInfo(Resource):
    def post(self):
        openId = checkLogin()
        checkSubscribe(openId)
        obj = database()
        info = obj.getInfo(openId)
        if info:
            abort(409, message="User already exists.")
        else:
            data = request.get_json(force=True)
            if checkTel(data['tel']):
                obj.updateInfo(openId, data['name'], data['tel'])
                return jsonify({
                    "errcode": 0,
                    "errmsg": ""
                })
            else:
                abort(400, message="Invalid telephone number.")
