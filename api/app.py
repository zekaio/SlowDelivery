import flask
import flask_restful
from flask_cors import CORS
from api.config.config import cfg
from api.resource.getDefaultFlag import getDefaultFlag
from api.resource.getInfo import getInfo
from api.resource.getFlag import getFlag
from api.resource.isOngoing import isOngoing
from api.resource.sendOfflineCapsule import sendOfflineCapsule
from api.resource.sendTimeCapsule import sendTimeCapsule
from api.resource.sendFlag import sendFlag
from api.resource.updateInfo import updateInfo

app = flask.Flask(__name__)
CORS(app, resources=r'/api/*', supports_credentials=True)
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

if __name__ == '__main__':
    app.run()
