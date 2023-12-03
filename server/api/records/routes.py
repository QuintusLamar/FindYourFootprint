from flask import Blueprint, current_app, jsonify, request
from api import db, cross_origin
from api.models import *
from api.utils import *

import jwt
import datetime

records = Blueprint("records", __name__)


@cross_origin
@records.route("/add_routerecord", methods=["POST"])
def add_routerecord():
    email = str(request.json.get("addRouteRecordFormData").get("email"))
    routeId = int(request.json.get("addrouteRecordFormData").get("routeId"))
    routeDistance = float(
        request.json.get("addrouteRecordFormData").get("routeDistance")
    )
    vehicleId = int(request.json.get("addrouteRecordFormData").get("vehicleId"))
    timestamp = datetime.datetime.now()
    carbonOutput = calculate_carbon_cost(routeDistance, vehicleId)

    userId = get_user_id(email)

    Records.insert().values(
        [
            {
                "userID": userId,
                "routeID": routeId,
                "carbonOutput": carbonOutput,
                "timestamp": timestamp,
                "vehicleID": vehicleId,
                "routeDistance": routeDistance,
            }
        ]
    )
    db.session().commit()
    return jsonify({"status": "Success! Added route record"})


@cross_origin
@records.route("/carboncost", methods=["GET"])
def calculate_carboncost():
    token = str(request.args.get("token"))
    driveDistance = float(request.args.get("driveDistance"))
    transitDistance = float(request.args.get("transitDistance"))
    print(token)
    user = auth_user(token)
    if not user:
        return jsonify({"error": "Invalid token"})
    vehicle = get_user_vehicle(user.id)

    # print(f"ROUTE DISTANCE: {routeDistance}")
    print(f"HERE IS YOUR VEHICLE TYPE: {vehicle}")
    main_carbonCost = calculate_carbon_cost(driveDistance)
    additional_carbonCost = calculate_carbon_cost(transitDistance)
    main_carbonCost["Bus"] = additional_carbonCost["Bus"]
    main_carbonCost["Train"] = additional_carbonCost["Train"]

    return jsonify(main_carbonCost)
