from flask import Flask
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    CORS(app)

    # Health check route — verify the service is running
    @app.route('/health', methods=['GET'])
    def health():
        return {
            'status': 'ok',
            'service': 'repowise-ai-service'
        }
    
    return app
