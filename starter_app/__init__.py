import os
from flask import Flask, render_template, request, session
from flask_cors import CORS
from flask_wtf.csrf import CSRFProtect, generate_csrf
from starter_app.models import db, User
from starter_app.api import session, post, users, counts, follow
from starter_app.config import Config
from flask_login import LoginManager, current_user

app = Flask(__name__)

app.config.from_object(Config)
app.register_blueprint(session.bp, url_prefix='/api/session')
app.register_blueprint(post.bp, url_prefix='/api/post')
app.register_blueprint(users.bp, url_prefix='/api/users')
app.register_blueprint(counts.bp, url_prefix='/api/number')
app.register_blueprint(follow.bp, url_prefix='/api/follow')
db.init_app(app)


# Application Security

CORS(app)
CSRFProtect(app)


@app.after_request
def inject_csrf_token(response):
    response.set_cookie('csrf_token',
                        generate_csrf(),
                        secure=True if os.environ.get('FLASK_ENV') else False,
                        samesite='Strict' if os.environ.get('FLASK_ENV')
                        else None,
                        httponly=True)
    return response


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def react_root(path):
    print("path", path)
    if path == 'favicon.ico':
        return app.send_static_file('favicon.ico')
    return app.send_static_file('index.html')


login = LoginManager(app)
login.login_view = "session.login"


@login.user_loader
def load_user(id):
    return User.query.get(int(id))


@app.route('/api/csrf/restore')
def restore_csrf():
    if current_user.is_authenticated:
        user = current_user.to_dict()
    else:
        user = None
    return {'csrf_token': generate_csrf(), 'user': user}
