from flask import jsonify
from flask_restful import Resource
from common.database import database
from common.utils import checkSubscribe, checkLogin


class getDefaultFlag(Resource):
    def get(self):
        openId = checkLogin()
        checkSubscribe(openId)
        obj = database()
        arr = obj.getDefaultFlag(openId)
        return jsonify({
            "flags": arr
        })
