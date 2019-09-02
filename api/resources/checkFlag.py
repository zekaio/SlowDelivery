from flask import jsonify
from flask_restful import Resource
from common.database import database
from common.utils import checkSubscribe, checkLogin


class checkFlag(Resource):
    def get(self):
        openId = checkLogin()
        checkSubscribe(openId)
        obj = database()
        return jsonify({
            "check_flag": obj.checkFlag(openId)
        })
