from flask import jsonify, request, session
from flask_restful import Resource, abort
import json
import requests
from common.database import database


class getDefaultFlag(Resource):
    def get(self):
        obj = database()
        arr = obj.getDefaultFlag()
        return jsonify({
            "flags": arr
        })
