from datetime import datetime
from api import db


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    name = db.Column(db.String(255), unique=False, nullable=False)
    vehicleID = db.Column(
        db.Integer, db.ForeignKey("vehicle.vehicleID"), unique=False, nullable=True
    )


class Vehicle(db.Model):
    vehicleID = db.Column(db.Integer, primary_key=True)
    vehicleType = db.Column(db.String(255), unique=False, nullable=False)
    cityMPG = db.Column(db.Float, unique=False, nullable=False)
    highwayMPG = db.Column(db.Float, unique=False, nullable=False)


class Friends(db.Model):
    userOneID = db.Column(
        db.Integer, db.ForeignKey("user.id"), unique=False, nullable=False
    )
    userTwoID = db.Column(
        db.Integer, db.ForeignKey("user.id"), unique=False, nullable=False
    )
    friendID = db.Column(db.Integer, primary_key=True)
    # user_one = db.relationship(
    #     "User",
    #     foreign_keys=[userOneId],
    #     backref=db.backref("friends_user_one", lazy=True),
    # )
    # user_two = db.relationship(
    #     "User",
    #     foreign_keys=[userTwoId],
    #     backref=db.backref("friends_user_two", lazy=True),
    # )


class Records(db.Model):
    userID = db.Column(db.Integer, db.ForeignKey("user.id"), unique=False)
    routeID = db.Column(db.Integer, primary_key=True, nullable=False)
    carbonOutput = db.Column(db.Float, unique=False, nullable=False)
    timestamp = db.Column(db.DateTime, unique=False, nullable=False)
    vehicleID = db.Column(db.Integer, unique=False, nullable=False)
    routeDistance = db.Column(db.Float, unique=False, nullable=False)
    # user = db.relationship("User", backref="records", lazy=True)
