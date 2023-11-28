from flask import jsonify, request, current_app, Blueprint
from api import db, bcrypt
from api.users.utils import get_user_id
from api.models import User, Friends
import jwt
import datetime


users = Blueprint("users", __name__)

session_days = 365


@users.route("/register", methods=["POST"])
def register():
    name = request.json.get("name")
    password = request.json.get("password")

    if not name or not password:
        return jsonify(error="Missing name/password")

    user = User.query.filter_by(name=name).first()
    if user:
        return jsonify(error=f"Sorry, the name {name} has been taken.")

    hashed_password = bcrypt.generate_password_hash(password).decode("utf-8")
    user = User(name=name, password=hashed_password)
    db.session.add(user)
    db.session.commit()

    token = jwt.encode(
        {
            "name": name,
            "password": password,
            "exp": datetime.datetime.utcnow() + datetime.timedelta(days=session_days),
        },
        current_app.config["SECRET_KEY"],
    )
    return jsonify(token=token.decode("utf-8"))


@users.route("/login", methods=["POST"])
def login():
    name = request.json.get("name")
    password = request.json.get("password")
    if not name or not password:
        return jsonify(error="Missing name/password")

    user = User.query.filter_by(name=name).first()
    if user and user.verify_password(password):
        token = jwt.encode(
            {
                "name": name,
                "password": password,
                "exp": datetime.datetime.utcnow()
                + datetime.timedelta(days=session_days),
            },
            current_app.config["SECRET_KEY"],
        )
        return jsonify(token=token.decode("utf-8"))

    return jsonify(error="Invalid credentials")


@users.route("/account", methods=["POST"])
def account():
    token = request.json.get("token")
    if not token:
        return jsonify(error="Missing token")

    try:
        token_data = jwt.decode(token, current_app.config["SECRET_KEY"])
    except:
        return jsonify(error="Token invalid or expired")

    name = token_data.get("name")
    password = token_data.get("password")
    if name is None or password is None:
        return jsonify(error="Missing token name/password")

    user = User.query.filter_by(name=name).first()
    if user and user.verify_password(password):
        return jsonify(name=name)

    return jsonify(error="Invalid token credentials")


@users.route("/friends", methods=["GET"])
def friends():
    token = request.json.get("token")
    if not token:
        return jsonify(error="Missing token")

    try:
        token_data = jwt.decode(token, current_app.config["SECRET_KEY"])
    except:
        return jsonify(error="Token invalid or expired")

    name = token_data.get("name")
    password = token_data.get("password")
    if name is None or password is None:
        return jsonify(error="Missing token name/password")
    userid = request.json.get("username")
    userID = get_user_id(userid)
    all_friends = Friends.query.filter_by(Friends.userOneId == userID)
    return jsonify(all_friends)


@users.route("/add_friend", methods=["POST"])
def add_friend():
    token = request.json.get("token")
    if not token:
        return jsonify(error="Missing token")

    try:
        token_data = jwt.decode(token, current_app.config["SECRET_KEY"])
    except:
        return jsonify(error="Token invalid or expired")

    name = token_data.get("name")
    password = token_data.get("password")
    if name is None or password is None:
        return jsonify(error="Missing token name/password")

    first_username = request.json.get("username1")
    second_username = request.json.get("username2")

    first = get_user_id(first_username)
    second = get_user_id(second_username)

    all_users = set(User.id)

    if first not in all_users or second not in all_users:
        return jsonify(error="Users do not exist")
    Friends.insert().values(
        [
            {"userOneId": first, "userTwoId": second},
            {"userOneId": second, "userTwoId": first},
        ]
    )

    return jsonify({"status": "Success! Added friend record"})
