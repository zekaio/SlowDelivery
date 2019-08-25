from flask import jsonify, request, session
from flask_restful import Resource, abort
import json
import requests
import pickle
from common.database import database


class sendFlag(Resource):
    def post(self):
        if "open_id" not in session:
            sess_id = request.cookies.get("PHPSESSID")
            if sess_id is not None:
                r = requests.get("https://hemc.100steps.net/2017/wechat/Home/Index/getUserInfo", timeout=5,
                                 cookies=dict(PHPSESSID=sess_id))
                try:
                    t = json.loads(r.text)
                    if "openid" in t:
                        session["open_id"] = t["openid"]
                except:
                    pass
        if "open_id" not in session:
            abort(401, message="Please bind Wechat account first.")
        obj = database()
        flag = obj.getFlag(session["open_id"])
        if flag:
            abort(409, message="Flag already exists.")
        else:
            data = request.get_json(force=True)
            _flag = pickle.dumps(data['flag'])
            obj.sendFlag(session["open_id"], _flag)
            return jsonify({
                "errcode": 0,
                "errmsg": ""
            })
