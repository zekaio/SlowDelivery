import flask
import flask_restful
from flask_cors import CORS
from config.config import cfg
from resources.getDefaultFlag import getDefaultFlag
from resources.getInfo import getInfo
from resources.getFlag import getFlag
from resources.isOngoing import isOngoing
from resources.sendOfflineCapsule import sendOfflineCapsule
from resources.sendTimeCapsule import sendTimeCapsule
from resources.sendFlag import sendFlag
from resources.updateInfo import updateInfo
from resources.checkTimeCapsule import checkTimeCapsule
from resources.checkFlag import checkFlag
from werkzeug.middleware.proxy_fix import ProxyFix

app = flask.Flask(__name__)
CORS(app, resources=r'/*', supports_credentials=True)
app.secret_key = cfg["secret_key"]
api = flask_restful.Api(app)

api.add_resource(isOngoing, '/isOngoing')
api.add_resource(getInfo, '/getInfo')
api.add_resource(getDefaultFlag, '/getDefaultFlag')
api.add_resource(getFlag, '/getFlag')
api.add_resource(sendOfflineCapsule, '/sendOfflineCapsule')
api.add_resource(sendTimeCapsule, '/sendTimeCapsule')
api.add_resource(sendFlag, '/sendFlag')
api.add_resource(updateInfo, '/updateInfo')
api.add_resource(checkTimeCapsule, '/checkTimeCapsule')
api.add_resource(checkFlag, '/checkFlag')

if __name__ == '__main__':
    app.wsgi_app = ProxyFix(app.wsgi_app)
    app.run(port=8765)
