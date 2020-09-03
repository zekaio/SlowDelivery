# -*- coding: utf-8 -*-
from flask import jsonify
from flask_restful import Resource, abort
import pickle
from common.database import database
from common.utils import checkSubscribe, checkLogin,checkTime


class getFlag(Resource):
    def get(self):
        checkTime()
        openId = checkLogin()
        # checkSubscribe(openId)
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
