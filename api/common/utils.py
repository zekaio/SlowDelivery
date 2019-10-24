# -*- coding: utf-8 -*-
import requests
from config.config import cfg
from flask import request, session
from flask_restful import abort
import json
import datetime
import time


# 检验手机号
def checkTel(s):
    s = str(s)
    return s.isdigit() and len(s) == 11


# 判断用户是否授权微信登录
def checkLogin():
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
    return session['open_id']


# 判断用户是否关注公众号
def checkSubscribe(open_id):
    if "check_sub" not in session or not session['check_sub']:
        response = requests.get('https://hemc.100steps.net/2017/wechat/Home/Index/getSubscribe?state=https://hemc.100steps.net/2017/wechat/Home/Index/getSubscribe').text
        if "subscribe" in response:
            if response['subscribe']:
                session['check_sub'] = True
                return True
            else:
                abort(406, message="Please subscribe first.")
                return False
    else:
        return True


# 判断时间
def checkTime():
    begin = datetime.datetime.strptime(cfg["begin"], '%Y-%m-%d %H:%M:%S')
    end = datetime.datetime.strptime(cfg["end"], '%Y-%m-%d %H:%M:%S')
    now = datetime.datetime.strptime(time.strftime("%Y-%m-%d %H:%M:%S", time.localtime()), '%Y-%m-%d %H:%M:%S')
    if now < begin:
        abort(410, message="活动还未开始")
        return False
    elif now > end:
        abort(410, message="活动已结束")
        return False
    else:
        return True
