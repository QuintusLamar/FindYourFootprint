from flask import current_app
from api.models import User, Vehicle
import jwt
from transport_co2 import Mode, estimate_co2

SESSION_DAYS = 365


def auth_user(token):
    try:
        token_data = jwt.decode(
            token, current_app.config["SECRET_KEY"], algorithms=["HS256"]
        )
    except:
        return None

    email = token_data.get("email")
    password = token_data.get("password")
    if email is None or password is None:
        return None
    user = User.query.filter_by(email=email).first()
    if user and user.verify_password(password):
        return user

    return None


def get_user_id(email):
    user_id = User.query.filter_by(email=str(email)).first()
    return user_id.id


def get_vehicle_id(vehicle_name):
    vehicle_id = Vehicle.query.filter_by(vehicleType=str(vehicle_name)).first()
    return vehicle_id.vehicleID if vehicle_id else None


def get_all_users():
    users = User.query.all()
    return users


def get_user_vehicle(user_id):
    vehicle_id = User.query.filter_by(id=user_id).first().vehicleID
    return Vehicle.query.filter_by(vehicleID=vehicle_id).first()


# This distance should be in miles
def calculate_carbon_cost(distance):
    # walking and biking does not contribute to any carbon cost
    return {
        "walking": 0,
        "biking": 0,
        "SUV": estimate_co2(mode="large_car", distance_in_km=distance * 1.609),
        "Sedan": estimate_co2(mode="small_car", distance_in_km=distance * 1.609),
        "Bus": estimate_co2(mode="transit", distance_in_km=distance * 1.609),
        "Train": estimate_co2(mode="LIGHT_RAIL", distance_in_km=distance * 1.609),
    }
