# -*- coding: utf-8 -*-
from flask import jsonify, request
from flask_restful import Resource, abort
import json
import requests
import hashlib
import base64
from common.database import database
from common.utils import checkSubscribe, checkLogin, checkTime


class sendTimeCapsule(Resource):
    def post(self):
        checkTime()
        openId = checkLogin()
        # checkSubscribe(openId)
        obj = database()
        data = request.get_json(force=True)
        if not obj.getInfo(openId):
            abort(404, message="请先填写信息")
        check = obj.checkTimeCapsule(openId)
        msg = None
        if check['check_voice'] or check['check_text']:
            time = obj.getTime(openId)
        else:
            time = data['time']
        if data['type'] == "voice":
            if check['check_voice']:
                abort(409, message="已经填写过语音信件了。")
            else:
                try:
                    msg = data['file_id']
                except:
                    abort(400, message="参数错误。")
                try:
                    r = requests.get(
                        "https://hemc.100steps.net/2017/wechat/Home/Public/getMedia?media_id=%s" % msg,
                        timeout=20)
                    t = json.loads(r.text)
                except:
                    abort(404, message="file_id错误")
                    return False
                if t["status"] == 0:
                    try:
                        f = open("media/%s.amr" % hashlib.md5(msg.encode(encoding='UTF-8')).hexdigest(), "wb")
                        f.write(base64.b64decode(t["data"]))
                        f.close()
                    except Exception as e:
                        abort(404, message=str(e))
                else:
                    abort(404, message="录音文件不存在。")
                obj.sendTimeCapsule(openId, data['type'], msg, time)
        else:
            if check['check_text']:
                abort(409, message="已经填写过文字信件了。")
            else:
                try:
                    msg = data['message']
                except:
                    abort(400, message="参数错误。")
            if data['send_offline']:
                obj.sendTimeCapsule(openId, data['type'], msg, time, data['send_offline'], data['address'])
            else:
                obj.sendTimeCapsule(openId, data['type'], msg, time, data['send_offline'])
        return jsonify({
            "errcode": 0,
            "errmsg": ""
        })
