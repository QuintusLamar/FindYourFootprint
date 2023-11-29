from flask import jsonify, request, current_app, Blueprint
from api import db
from api.users.utils import get_user_id, get_vehicle_id, get_all_users, calculate_carbon_cost
from api.models import User, Friends, Records
import jwt
import datetime



users = Blueprint("users", __name__)

session_days = 365


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

    # print(f"email: {email}")
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

    # allUsers = get_all_users()
    # for i in allUsers:
    #     print(i.name)
    
    return jsonify({"status": "Success! Updated your profile!"})




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