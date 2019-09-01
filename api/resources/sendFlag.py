from flask import jsonify, request, session
from flask_restful import Resource, abort
import pickle
from common.database import database
from common.utils import checkSubscribe, checkLogin


class sendFlag(Resource):
    def post(self):
        openId = checkLogin()
        checkSubscribe(openId)
        obj = database()
        flag = obj.getFlag(openId)
        if flag:
            abort(409, message="Flag already exists.")
        else:
            data = request.get_json(force=True)
            _flag = pickle.dumps(data['flag'])
            if obj.sendFlag(openId, data['name'], _flag):
                return jsonify({
                    "errcode": 0
                })
            else:
                abort(404, message="No information for user.")
