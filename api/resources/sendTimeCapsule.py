from flask import jsonify, request, session
from flask_restful import Resource, abort
import json
import requests
import hashlib
import base64
from common.database import database
from common.utils import checkSubscribe, checkLogin


class sendTimeCapsule(Resource):
    def post(self):
        openId = checkLogin()
        checkSubscribe(openId)
        obj = database()
        data = request.get_json(force=True)
        if data['type'] == "voice":
            msg = data['file_id']
            if msg is None:
                abort(400, message="Missing parameter: file_id.")
            else:
                r = requests.get(
                    "https://hemc.100steps.net/2017/wechat/Home/Public/getMedia?media_id=%s" % msg,
                    timeout=20)
                try:
                    t = json.loads(r.text)
                    if t["status"] == 0:
                        f = open("media/%s.amr" % hashlib.md5(msg.encode(encoding='UTF-8')).hexdigest(),
                                 "wb")
                        f.write(base64.b64decode(t["data"]))
                        f.close()
                    else:
                        abort(404, message="Media not found.")
                except:
                    abort(404, message="Media not found.")
        else:
            msg = data['message']
            if msg is None:
                abort(400, message="Missing parameter: message.")

        if obj.sendTimeCapsule(session["open_id"], data['type'], msg, data['time']):
            return jsonify({
                "errcode": 0,
                "errmsg": ""
            })
        else:
            abort(405, message="No information for user.")
