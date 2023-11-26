from datetime import datetime
from api import db, bcrypt


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(255), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    name = db.Column(db.String(255), unique=False, nullable=False)
    vehicleId = db.Column(db.Integer, db.ForeignKey('vehicle.vehicleId'), unique=True, nullable=False)
    vehicle = db.relationship('Vehicle', backref='user', lazy=True)

    def verify_password(self, password):
        return bcrypt.check_password_hash(self.password, password)
    

class Vehicle(db.Model):
    vehicleId = db.Column(db.Integer, primary_key=True)
    vehicleType = db.Column(db.String(255), unique=False, nullable=False)
    cityMpg = db.Column(db.Float, unique=False, nullable=False)
    highwayMpg = db.Column(db.Float, unique=False, nullable=False)
    fuelType = db.Column(db.Integer, unique=False, nullable=False)


class Friends(db.Model):
    userOneId = db.Column(db.Integer, db.ForeignKey('user.id'), primary_key=True)
    userTwoId = db.Column(db.Integer, db.ForeignKey('user.id'), unique=False, nullable=False)
    user_one = db.relationship('User', foreign_keys=[userOneId], backref=db.backref('friends_user_one', lazy=True))
    user_two = db.relationship('User', foreign_keys=[userTwoId], backref=db.backref('friends_user_two', lazy=True))

class Records(db.Model):
    userId = db.Column(db.Integer, db.ForeignKey('user.id'), primary_key=True)
    routeId = db.Column(db.Integer, unique=False, nullable=False)
    carbonOutput = db.Column(db.Float, unique=False, nullable=False)
    timeStamp = db.Column(db.DateTime, unique=False, nullable=False)
    methodOfTransportation = db.Column(db.Integer, unique=False, nullable=False)
    user = db.relationship('User', backref='records', lazy=True)



    


    

