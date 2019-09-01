import requests
from config.config import cfg
from flask import request, session
from flask_restful import abort
import json


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
    # headers = {
    #     'User-Agent': "Mozilla/5.0 (Windows NT 10.0; Win64; x64)AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.132 Safari/537.36"}
    # response = requests.get(
    #     "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=" + cfg['APPID'] + "&secret=" + cfg[
    #         'AppSecret'], headers=headers).text
    # if "errcode" in response:
    #     abort(401, message="APPID is invalid.")
    #     return False
    # else:
    #     assess_token = response['access_token']
    # userinfo = requests.get(
    #     "https://api.weixin.qq.com/cgi-bin/user/info?access_token=" + assess_token + "&openid=" + open_id + "&lang=zh_CN").text
    # if "subscribe" in userinfo:
    #     subscribe = userinfo['subscribe']
    #     if subscribe:
    #         return True
    #     else:
    #         abort(407, message="Please subscribe first.")
    #         return False

    """
    for test
    """
    return True
