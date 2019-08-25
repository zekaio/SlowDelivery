from flask import jsonify, request, session
from flask_restful import Resource, abort
import json
import requests
from common.database import database
from common.utils import checkTel


class sendOfflineCapsule(Resource):
    def post(self):
        data = request.get_json(force=True)
        if checkTel(data['sender_tel']) and checkTel(data['receiver_tel']):
            obj = database()
            obj.sendOfflineCapsule(data['sender_name'], data['sender_tel'], data['receiver_name'], data['receiver_tel'],
                                   data['receiver_addr'], data['capsule_tag'], data['time'])
            return jsonify({
                "errcode": 0,
                "errmsg": ""
            })
