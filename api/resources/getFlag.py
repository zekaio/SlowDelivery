from flask import jsonify, session
from flask_restful import Resource, abort
import pickle
from common.database import database
from common.utils import checkSubscribe,checkLogin


class getFlag(Resource):
    def get(self):
        openId = checkLogin()
        checkSubscribe(openId)
        obj = database()
        flag = obj.getFlag(session["open_id"])
        if flag:
            _flag = pickle.loads(flag)
            return jsonify({
                "flag": _flag
            })
        else:
            abort(404, message="Flag does not exist.")
