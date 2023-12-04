from datetime import datetime
from api import db, bcrypt


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    name = db.Column(db.String(255), unique=False, nullable=False)
    vehicleID = db.Column(
        db.Integer, db.ForeignKey("vehicle.vehicleID"), unique=False, nullable=True
    )

    def verify_password(self, password):
        return bcrypt.check_password_hash(self.password, password)


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


class Records(db.Model):
    userID = db.Column(db.Integer, db.ForeignKey("user.id"), unique=False)
    routeID = db.Column(db.Integer, primary_key=True, nullable=False, unique=True)
    carbonOutput = db.Column(db.Float, unique=False, nullable=False)
    timestamp = db.Column(db.DateTime, unique=False, nullable=False)
    vehicleID = db.Column(db.Integer, unique=False, nullable=False)
    routeDistance = db.Column(db.Float, unique=False, nullable=False)
