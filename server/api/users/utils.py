from flask import current_app
from api.models import User, Vehicle
import jwt
from transport_co2 import Mode, estimate_co2


def auth_user(token):
    try:
        print(token)
        token_data = jwt.decode(token, current_app.config["SECRET_KEY"])
    except:
        print("[AUTH ERROR] 1")
        return None

    name = token_data.get("name")
    password = token_data.get("password")
    if name is None or password is None:
        print("[AUTH ERROR] 2")
        return None

    user = User.query.filter_by(name=name).first()
    if user and user.verify_password(password):
        return user

    print("[AUTH ERROR] 3")
    return None


def get_user_id(email):
    # for i in list(User.query.all()):
    #     print(i.name, i.id, i.username, i.password)
    print('INSIDE GET USER ID FUNCTION')
    user_id = User.query.filter_by(email=str(email)).first()
    return user_id.id


def get_vehicle_id(vehicle_name):
    vehicle_id = Vehicle.query.filter_by(vehicleType=str(vehicle_name)).first()
    return vehicle_id.vehicleID

def get_all_users():
    users =  User.query.all()
    return users

# This distance should be in miles
def calculate_carbon_cost(distance, vehicle):
    if vehicle == "train":
        return estimate_co2(mode="LIGHT_RAIL", distance_in_km=distance * 1.609)
    else:
        return estimate_co2(mode="")
