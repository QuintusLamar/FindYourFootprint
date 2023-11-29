from flask import jsonify, request, current_app, Blueprint
from api import db
from api.users.utils import *
from api.models import *
import jwt
import datetime

from sqlalchemy import select, func


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


@users.route("/leaderboard", methods=["GET"])
def leaderboard():
    email = request.args.get('param1')
    # userId = get_user_id(email)
    time_period = request.args.get('param2')

    if time_period == "week":
        delta = datetime.timedelta(days=7) 
    elif time_period == "month":
        delta = datetime.timedelta(days=30)
    elif time_period == "year":
        delta = datetime.timedelta(days=365)
    time_bound = datetime.datetime.now() - delta

    print("GOT HERE")

    print("\n\n", time_bound, "\n\n")
    
    is_friends_only = False
    if is_friends_only:

        table = select(
            Records.userID, 
            func.sum(Records.carbonOutput)
        ).select_from(
            Records
        ).join(
            Friends, Records.userId == Friends.userOneId
        ).where(
            Records.userId == "user_5"
        ).group_by(
            Records.userId
        ).filter(
            Records.timeStamp >= time_bound
        )

        return None #jsonify(table)
    
    else:

        # userID=i,
        # routeID=routeid,
        # carbonOutput=random.random() * 50 + 10,
        # timestamp=datetime.now() - timedelta(days=random.randint(1, 50)),
        # vehicleID=random.r

        all_records = Records.query.all()

        # Print the results
        for record in all_records:
            print(f"UserID: {record.userID}, Route ID: {record.routeID}, Carbon Output: {record.carbonOutput}, Timestamp: {record.timestamp}")

        # result = Records.query \
        #     .with_entities(Records.userID, db.func.sum(Records.carbonOutput).label('total_carbon_output')) \
        #     .filter(Records.timestamp >= time_bound) \
        #     .group_by(Records.userID) \
        #     .all()

        # # Fetch and print the results
        # for row in result:
        #     print(f"UserID: {row.userID}, Total Carbon Output: {row.total_carbon_output}")
        
        print("FINISH")

        # query = select(
        #     Records.userID,
        #     func.sum(Records.carbonOutput)
        # ).select_from(
        #     Records
        # ).group_by(
        #     Records.userID
        # ).filter(
        #     Records.timestamp >= time_bound
        # )

        
        # result = db.engine.execute(query)
        # for row in result.fetchall():
        #     print(f"UserID: {row[0]}, Total Carbon Output: {row[1]}")

        return None #jsonify(table)



@users.route("/records", methods=["POST"])
def add_record():
    token = request.json.get("token")
    if not token:
        return jsonify(error="Missing token")

    try:
        token_data = jwt.decode(token, current_app.config["SECRET_KEY"])
    except:
        return jsonify(error="Token invalid or expired")
