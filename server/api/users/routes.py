from flask import Blueprint, current_app, jsonify, request
from api import db
from api.models import *
from api.users.utils import *

import jwt
import datetime

from sqlalchemy import select, func, asc

users = Blueprint("users", __name__)

session_days = 365

@users.route('/register', methods=['POST'])
def register():
    name = str(request.json.get("registerProfileFormData").get("name"))
    password = str(request.json.get("registerProfileFormData").get("password"))
    email = str(request.json.get("registerProfileFormData").get("email"))
    vehicle = str(request.json.get("registerProfileFormData").get("vehicle"))

    if not name or not password or not email or not vehicle:
        return jsonify({'success': False, 'message': 'Missing fields'})

    if User.query.filter_by(email=email).first():
        return jsonify({'success': False, 'message': 'Username is already taken'})

    uid_query = (
        select(
            func.max(User.id)
        )
        .select_from(
            User
        )
    )
    max_uid = int(db.session.execute(uid_query).scalar())

    vid_query = (
        select(
            func.max(User.vehicleID)
        )
        .select_from(
            User
        )
    )
    max_vid = int(db.session.execute(vid_query).scalar())

    new_user = User(
        id = max_uid + 1,
        name = name,
        password = password,
        email = email,
        vehicleID = max_vid + 1
    )
    db.session.add(new_user)
    db.session().commit()

    query = (
        select(
            User.vehicleID
        )
        .select_from(
            User
        ).where(
            User.email == email
        )
    )
    print(db.session.execute(query).first())

    return jsonify({'success': True, 'message': 'Registration successful'})


# @users.route("/register", methods=["POST"])
# def register():
#     name = request.json.get("name")
#     password = request.json.get("password")

#     if not name or not password:
#         return jsonify(error="Missing name/password")

#     user = User.query.filter_by(name=name).first()
#     if user:
#         return jsonify(error=f"Sorry, the name {name} has been taken.")

#     hashed_password = bcrypt.generate_password_hash(password).decode("utf-8")
#     user = User(name=name, password=hashed_password)
#     db.session.add(user)
#     db.session.commit()

#     token = jwt.encode(
#         {
#             "name": name,
#             "password": password,
#             "exp": datetime.datetime.utcnow() + datetime.timedelta(days=session_days),
#         },
#         current_app.config["SECRET_KEY"],
#     )
#     return jsonify(token=token.decode("utf-8"))


@users.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    query = (
        select(
            User.email,
            User.password,
        )
        .select_from(
            User
        ).where(
            User.email == email and User.password == password
        )
    )

    try:
        input_email, input_password = db.session.execute(query).first()
    except:
        return jsonify({'success': False, 'message': 'User does not exist'})

    if input_email == email and input_password == password:
        return jsonify({'success': True, 'message': 'Login successful'})

    return jsonify({'success': False, 'message': 'Invalid credentials'})


# @users.route("/login", methods=["POST"])
# def login():
#     name = request.json.get("name")
#     password = request.json.get("password")
#     if not name or not password:
#         return jsonify(error="Missing name/password")

#     user = User.query.filter_by(name=name).first()
#     if user and user.verify_password(password):
#         token = jwt.encode(
#             {
#                 "name": name,
#                 "password": password,
#                 "exp": datetime.datetime.utcnow()
#                 + datetime.timedelta(days=session_days),
#             },
#             current_app.config["SECRET_KEY"],
#         )
#         return jsonify(token=token.decode("utf-8"))

#     return jsonify(error="Invalid credentials")


@users.route("/friends", methods=["GET"])
def friends():
    name = request.json.get("name")
    if name is None:
        return jsonify(error="Missing token name/password")
    userid = request.json.get("username")
    userID = get_user_id(userid)
    all_friends = Friends.query.filter_by(Friends.userOneId == userID)
    return jsonify(all_friends)


@users.route("/add_friend", methods=["POST"])
def add_friend():
    name = request.json.get("name")
    if name is None:
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
    db.session().commit()
    return jsonify({"status": "Success! Added friend record"})


@users.route("/update_profile", methods=["POST"])
def update_profile():
    name = str(request.json.get("updateProfileFormData").get("name"))
    password = str(request.json.get("updateProfileFormData").get("password"))
    email = str(request.json.get("updateProfileFormData").get("email"))
    vehicle = str(request.json.get("updateProfileFormData").get("vehicle"))

    userId = get_user_id(email)
    if userId is None:
        return jsonify(error="User does not exist. Please register user.")

    user = User.query.filter(User.id == userId).first()
    vehicleID = get_vehicle_id(vehicle)
    user.name = name
    if password is not None:
        user.password = password
    user.vehicleID = vehicleID
    db.session().commit()

    return jsonify({"status": "Success! Updated your profile!"})


@users.route("/leaderboard", methods=["GET"])
def leaderboard():
    email = str(request.args.get("email"))
    is_friends_only = str(request.args.get("is_friends_only")).lower() == "friends"
    userId = get_user_id(email)

    time_period = str(request.args.get("time_period"))
    delta = None
    if time_period == "thisweek":
        delta = datetime.timedelta(days=7)
    elif time_period == "thismonth":
        delta = datetime.timedelta(days=30)
    elif time_period == "thisyear":
        delta = datetime.timedelta(days=365)
    elif time_period == "alltime":
        delta = datetime.datetime.now() - datetime.datetime(1970, 1, 1)
    time_bound = datetime.datetime.now() - delta

    if is_friends_only:
        all_friends = Friends.query.filter(Friends.userOneID == userId).all()
        all_friends = set([a.userTwoID for a in all_friends])
        all_friends.add(userId)
        query = (
            select(
                Records.userID,
                User.email,
                User.name,
                func.sum(Records.carbonOutput).label("carbon_output"),
            )
            .select_from(Records)
            .join(User, User.id == Records.userID)
            .where(Records.userID.in_(all_friends))
            .group_by(Records.userID)
            .filter(Records.timestamp >= time_bound)
            .order_by(asc("carbon_output"))
        )
        result = db.session.execute(query).fetchall()
        return jsonify(
            [(i + 1, row.name, row.carbon_output) for i, row in enumerate(result)]
        )

    else:
        query = (
            select(
                User.name,
                func.sum(Records.carbonOutput).label("carbon_output"),
            )
            .select_from(Records)
            .join(User, User.id == Records.userID)
            .group_by(Records.userID)
            .filter(Records.timestamp >= time_bound)
            .order_by(asc("carbon_output"))
        )

        result = db.session.execute(query).fetchall()
        return jsonify(
            [(i + 1, row.name, row.carbon_output) for i, row in enumerate(result)]
        )


@users.route("/records", methods=["POST"])
def add_record():
    token = request.json.get("token")
    if not token:
        return jsonify(error="Missing token")

    try:
        token_data = jwt.decode(token, current_app.config["SECRET_KEY"])
    except:
        return jsonify(error="Token invalid or expired")


@users.route("/add_routerecord", methods=["POST"])
def add_routerecord():
    email = str(request.json.get("addRouteRecordFormData").get("email"))
    routeId = int(request.json.get("addrouteRecordFormData").get("routeId"))
    routeDistance = float(request.json.get("addrouteRecordFormData").get("routeDistance"))
    vehicleId = int(request.json.get("addrouteRecordFormData").get("vehicleId"))
    timestamp = datetime.datetime.now()
    carbonOutput = calculate_carbon_cost(routeDistance, vehicleId)

    userId = get_user_id(email)

    Records.insert().values(
        [
            {"userID": userId, "routeID": routeId, "carbonOutput": carbonOutput, "timestamp": timestamp, "vehicleID": vehicleId, "routeDistance": routeDistance}
        ]
    )
    db.session().commit()
    return jsonify({"status": "Success! Added route record"})

@users.route("/calculate_carboncost", methods=["POST"])
def calculate_carboncost():
    routeDistance = float(request.json.get("currentRouteFormData").get("routeDistance"))
    vehicle = str(request.json.get("currentRouteFormData").get("vehicleId"))

    print(f"ROUTE DISTANCE: {routeDistance}")
    print(f"HERE IS YOUR VEHICLE TYPE: {vehicle}")
    carbonCost = calculate_carbon_cost(routeDistance, vehicle)

    print(f"HERE IS THE CALCULATED CARBON COST: {carbonCost}")

    return jsonify(carbonCost)
