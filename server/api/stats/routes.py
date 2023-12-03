from flask import Blueprint, current_app, jsonify, request
from api import db, cross_origin
from api.models import *
from api.utils import *
import bcrypt


import jwt
import datetime

from sqlalchemy import select, func, asc

stats = Blueprint("stats", __name__)


@cross_origin
@stats.route("/leaderboard", methods=["GET"])
def leaderboard():
    token = str(request.args.get("token"))
    print("hello world:", token)
    user = auth_user(token)
    if not user:
        return jsonify({"error": "Invalid token"})
    is_friends_only = str(request.args.get("is_friends_only")).lower() == "friends"
    userId = user.id
    print("here")
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


@cross_origin
@stats.route("/user_stats", methods=["GET"])
def user_stats():
    token = str(request.args.get("token"))
    user = auth_user(token)
    if not user:
        return jsonify({"error": "Invalid token"})
    userId = user.id
    query = (
        select(
            Records.userID,
            User.email,
            User.name,
            func.sum(Records.carbonOutput).label("carbon_output"),
            func.sum(Records.routeDistance).label("total_distance"),
        )
        .select_from(Records)
        .where(Records.userID == userId)
        .join(User, User.id == Records.userID)
        .group_by(Records.userID)
    )
    result = db.session.execute(query).first()
    if not result:
        return jsonify(
            {
                "email": user.email,
                "name": user.name,
                "total_distance": 0,
                "saved_carbon": 0,
            }
        )
    total_carbon_output = result.carbon_output
    max_carbon_output = calculate_carbon_cost(result.total_distance)["SUV"]
    return jsonify(
        {
            "email": result.email,
            "name": result.name,
            "total_distance": result.total_distance,
            "saved_carbon": max_carbon_output - total_carbon_output,
        }
    )
