from flask import jsonify
from flask_restful import Resource, abort
import pickle
from common.database import database
from common.utils import checkSubscribe, checkLogin


class getFlag(Resource):
    def get(self):
        openId = checkLogin()
        checkSubscribe(openId)
        obj = database()
        flag = obj.getFlag(openId)
        name = obj.getInfo(openId)['name']
        if flag:
            _flag = pickle.loads(flag)
            print(_flag[0])
            return jsonify({
                "name": name,
                "flag": _flag
            })
        else:
            abort(404, message="请先填写flag。")
