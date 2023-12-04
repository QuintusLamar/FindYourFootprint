from flask import Flask
from api.config import Config

from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_cors import CORS

import logging


import random
from datetime import datetime, timedelta

db = SQLAlchemy()
bcrypt = Bcrypt()
logging.getLogger("flask_cors").level = logging.DEBUG

from api.models import User, Vehicle, Friends, Records


def seed_database():
    for id in range(10):
        vehicle_type = random.choice(["Sedan", "SUV", "Truck"])
        city_mpg = random.uniform(15.0, 30.0)
        highway_mpg = random.uniform(20.0, 40.0)
        vehicle = Vehicle(
            vehicleType=vehicle_type,
            cityMPG=city_mpg,
            highwayMPG=highway_mpg,
            vehicleID=id,
        )
        db.session.add(vehicle)
    db.session.add(
        Vehicle(
            vehicleType="Marta",
            cityMPG=100,
            highwayMPG=200,
            vehicleID=10,
        )
    )
    db.session.add(
        Vehicle(
            vehicleType="Bike",
            cityMPG=-1,
            highwayMPG=-1,
            vehicleID=11,
        )
    )
    db.session.add(
        Vehicle(
            vehicleType="Bus",
            cityMPG=30,
            highwayMPG=40,
            vehicleID=12,
        )
    )
    db.session.add(
        Vehicle(
            vehicleType="SUV",
            cityMPG=30,
            highwayMPG=40,
            vehicleID=13,
        )
    )
    names = [
        "Josh",
        "Kyler",
        "Tim",
        "Aaron",
        "Sarang",
        "Quintus",
        "Manoj",
        "Sharan",
        "Utkarsh",
        "Tom",
    ]
    usernames = [i for i in range(10)]
    for idx in range(10):
        username = f"user_{usernames[idx]}"
        email = f"{username}@example.com"
        password = "abcde123"
        name = names[idx]
        user = User(
            id=idx,
            email=email,
            name=name,
            vehicleID=random.randint(0, 9),
            password=bcrypt.generate_password_hash(password),
        )
        db.session.add(user)

    friendid = 0
    for i in range(10):
        for j in range(i):
            friend_record1 = Friends(userOneID=i, userTwoID=j, friendID=friendid)
            friend_record2 = Friends(userOneID=j, userTwoID=i, friendID=friendid + 1)
            db.session.add(friend_record1)
            db.session.add(friend_record2)
            friendid += 2

    routeid = 0
    for i in range(10):
        for j in range(10):
            curr_user = names[i]
            record = Records(
                userID=i,
                routeID=routeid,
                carbonOutput=random.random() * 50 + 10,
                timestamp=datetime.now() - timedelta(days=random.randint(1, 50)),
                vehicleID=random.randint(0, 9),
                routeDistance=random.random() * 100 + 10,
            )
            db.session.add(record)
            routeid += 1

    db.session.commit()


def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    bcrypt.init_app(app)

    from api.users.routes import users
    from api.main.routes import main
    from api.records.routes import records
    from api.stats.routes import stats

    app.register_blueprint(users)
    app.register_blueprint(main)
    app.register_blueprint(records)
    app.register_blueprint(stats)

    with app.app_context():
        CORS(
            app,
            origins=[
                "http://localhost:3000",
            ],
        )
        db.drop_all()
        db.create_all()
        seed_database()
        return app
