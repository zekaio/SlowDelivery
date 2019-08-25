from flask import jsonify
from flask_restful import Resource
from api.common.database import database


class getDefaultFlag(Resource):
    def get(self):
        obj = database()
        arr = obj.getDefaultFlag()
        return jsonify({
            "flags": arr
        })
