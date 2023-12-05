from flask import Blueprint, current_app, jsonify, request
from api import db
from api.models import *
from api.utils import *

import jwt
import datetime
from sqlalchemy import select, func, asc, and_

records = Blueprint("records", __name__)


@records.route("/route_record", methods=["POST"])
def add_routeRecord():
    print("\n \n INSIDE ADD ROUTE RECORD \n \n")

    token = request.json.get("token")
    if not token:
        return jsonify(error="Missing token")
    user = auth_user(token)
    if not user:
        return jsonify(error="Invalid token")

    data = request.get_json()
    currentuserID = user.id
    rId_query = select(func.max(Records.routeID)).select_from(Records)
    max_rId = int(db.session.execute(rId_query).scalar())
    currentRouteId = max_rId + 1
    mode = data["mode"]
    if mode == "drive":
        mode = get_user_vehicle(currentuserID).vehicleID
    else:
        mode = get_vehicle_id(mode)

    currentcarbonOutput = data.get("currentOptionCO2")
    print("\n \n \n \n")
    print(f"CURRENT CARBON OUTPUT: {currentcarbonOutput}")
    print("\n \n \n \n")
    currenttimestamp = datetime.datetime.now()
    currentvehicleID = mode
    currentDistance = float(data.get("currentOptionDistance"))
    print("\n \n \n \n")
    print(f"CURRENT CARBON OUTPUT: {currentDistance}")
    print("\n \n \n \n")

    db.session.add(
        Records(
            userID=currentuserID,
            carbonOutput=currentcarbonOutput,
            timestamp=currenttimestamp,
            vehicleID=currentvehicleID,
            routeDistance=currentDistance,
            routeID=currentRouteId,
        )
    )
    db.session.commit()

    all_records = Records.query.all()

    for record in all_records:
        print("\n \n \n \n")
        print(
            f"UserID: {record.userID}, RouteID: {record.routeID}, Carbon Output: {record.carbonOutput}, Timestamp: {record.timestamp}, VehicleID: {record.vehicleID}, Route Distance: {record.routeDistance}"
        )
        print("\n \n \n \n")

    return jsonify({"status": "Success! Added route record"})


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
