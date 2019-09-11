from flask import jsonify
from flask_restful import Resource, abort
from common.database import database
from common.utils import checkSubscribe, checkLogin


class checkFlag(Resource):
    def get(self):
        openId = checkLogin()
        checkSubscribe(openId)
        obj = database()
        if not obj.getInfo(openId):
            abort(404, message="请先填写信息")
        return jsonify({
            "check_flag": obj.checkFlag(openId)
        })
