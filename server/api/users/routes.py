from flask import Blueprint, current_app, jsonify, request
from api import db, bcrypt
from api.models import *
from api.utils import *
from api.models import Records

import jwt
import datetime

from sqlalchemy import select, func, asc, and_, or_, in_

users = Blueprint("users", __name__)


@users.route("/register", methods=["POST"])
def register():
    name = str(request.json.get("registerProfileFormData").get("name"))
    password = str(request.json.get("registerProfileFormData").get("password"))
    email = str(request.json.get("registerProfileFormData").get("email"))
    vehicle = str(request.json.get("registerProfileFormData").get("vehicle"))

    if not name or not password or not email or not vehicle:
        return jsonify({"success": False, "message": "Missing fields"})

    if User.query.filter_by(email=email).first():
        return jsonify({"success": False, "message": "Username is already taken"})

    hashed_password = bcrypt.generate_password_hash(password).decode("utf-8")
    uid_query = select(func.max(User.id)).select_from(User)
    max_uid = int(db.session.execute(uid_query).scalar())

    # We are hardcoding a list of supported vehicles for now, so changing this query to reflect that
    id = get_vehicle_id(vehicle)
    if not id:
        return jsonify({"success": False, "message": "Vehicle does not exist"})

    new_user = User(
        id=max_uid + 1, name=name, password=hashed_password, email=email, vehicleID=id
    )
    db.session.add(new_user)
    db.session().commit()

    token = jwt.encode(
        {
            "email": email,
            "password": password,
            "exp": datetime.datetime.utcnow() + datetime.timedelta(days=SESSION_DAYS),
        },
        current_app.config["SECRET_KEY"],
    )
    return jsonify({"success": True, "token": token})


@users.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    user = User.query.filter_by(email=email).first()

    if not user:
        return jsonify({"success": False, "message": "User does not exist"})

    if user and user.verify_password(password):
        token = jwt.encode(
            {
                "email": email,
                "password": password,
                "exp": datetime.datetime.utcnow()
                + datetime.timedelta(days=SESSION_DAYS),
            },
            current_app.config["SECRET_KEY"],
        )
        return jsonify({"success": True, "token": token})

    return jsonify({"success": False, "message": "Invalid credentials"})


@users.route("/friends", methods=["GET"])
def friends():
    token = request.json.get("token")
    if not token:
        return jsonify(error="Missing token")
    user = auth_user(token)
    if not user:
        return jsonify(error="Invalid token")

    userID = user.id
    all_friends = Friends.query.filter(Friends.userOneID == userID).all()
    all_friends = set([a.userTwoID for a in all_friends])
    query = (
        select(
            User.name,
            User.email
        )
        .select_from(Records)
        .join(User, User.id == Records.userID)
        .where(Records.userID.in_(all_friends))
        .group_by(Records.userID)
        .order_by(asc(User.name))
    )
    result = db.session.execute(query).fetchall()
    return jsonify(
        [
            (i + 1, row.name, row.carbon_output, row.vehicle_type)
            for i, row in enumerate(result)
        ]
    )


@users.route("/add_friend", methods=["POST"])
def add_friend():

    token = request.json.get("token")
    if not token:
        print("ERROR!!!")
        return jsonify(error="Missing token")
    user = auth_user(token)
    if not user:
        return jsonify(error="Invalid token")
    
    second_email = request.json.get("email")

    first = user.id
    second = get_user_id(second_email)

    query = select(User.id).select_from(User)
    all_users = db.session.execute(query).fetchall()
    
    first_exists = any(first in tup for tup in all_users)
    second_exists = any(second in tup for tup in all_users)

    if not first_exists or not second_exists:
        return jsonify(error="Users do not exist")
    
    id_query = select(func.max(Friends.friendID)).select_from(Friends)
    max_id = int(db.session.execute(id_query).scalar())

    db.session.add(
        Friends(
            userOneID=first,
            userTwoID=second,
            friendID=max_id + 1
        )
    )
    db.session.add(
        Friends(
            userOneID=first,
            userTwoID=second,
            friendID=max_id + 2
        )
    )
    db.session().commit()
    return jsonify({"status": "Success! Added friend record"})


@users.route("/remove_friend", methods=["POST"])
def remove_friend():
    token = request.json.get("token")
    if not token:
        return jsonify(error="Missing token")
    user = auth_user(token)
    if not user:
        return jsonify(error="Invalid token")

    second_email = request.json.get("email")

    first = user.id
    second = get_user_id(second_email)

    query = select(User.id).select_from(User)
    all_users = db.session.execute(query).fetchall()

    first_exists = any(first in tup for tup in all_users)
    second_exists = any(second in tup for tup in all_users)

    if not first_exists or not second_exists:
        return jsonify(error="Users do not exist")
    
    delete_query = Friends.__table__.delete().where(
        or_(
            and_(Friends.userOneID == first, Friends.userTwoID == second),
            and_(Friends.userOneID == second, Friends.userTwoID == first)
        )
    )
    db.session.execute(delete_query)
    db.session().commit()

    return jsonify({"status": "success", "msg": "Deleted friend record!"})


@users.route("/update_profile", methods=["POST"])
def update_profile():
    token = request.json.get("token")
    if not token:
        return jsonify(error="Missing token")
    user = auth_user(token)
    if not user:
        return jsonify(error="Invalid token")

    name = str(request.json.get("updateProfileFormData").get("name"))
    password = str(request.json.get("updateProfileFormData").get("password"))
    # email = str(request.json.get("updateProfileFormData").get("email"))
    vehicle = str(request.json.get("updateProfileFormData").get("vehicle"))
    print(name)
    print(vehicle)
    print(password)

    vehicleID = get_vehicle_id(vehicle)
    user.name = name
    if password is not None and len(password) > 0:
        user.password = bcrypt.generate_password_hash(password)
    # user.email = email
    user.vehicleID = vehicleID
    try:
        db.session().commit()
    except:
        jsonify({"status": "Profile update failed!"})

    return jsonify({"status": "Success! Updated your profile!"})


@users.route("/valid_token", methods=["POST"])
def account():
    token = request.json.get("token")
    if not token:
        return jsonify(error="Missing token")
    user = auth_user(token)
    print(user)
    if not user:
        return jsonify(error="Invalid token")
    return jsonify({"status": "success"})

