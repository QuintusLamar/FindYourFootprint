from flask import Flask
from api.config import Config

from flask_sqlalchemy import SQLAlchemy
import random
from datetime import datetime, timedelta

db = SQLAlchemy()

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
        print(vehicle_type)
        db.session.add(vehicle)
    db.session.add(
        Vehicle(
            vehicleType="Marta",
            cityMPG=-1,
            highwayMPG=-1,
            vehicleID=10,
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
        print(email)
        password = "abcde123"
        name = names[idx]
        user = User(
            id=idx,
            email=email,
            name=name,
            vehicleID=random.randint(0, 9),
            password=password,
        )
        db.session.add(user)

    friendid = 0
    for i in range(10):
        for j in range(i):
            # name1 = names[i]
            # name2 = names[j]
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
                routeDistance = random.random() * 100 + 10
            )
            db.session.add(record)
            routeid += 1
    db.session.commit()


def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)

    from api.users.routes import users
    from api.main.routes import main

    app.register_blueprint(users)
    app.register_blueprint(main)

    @app.after_request
    def apply_caching(response):
        response.headers["Access-Control-Allow-Origin"] = "*"
        response.headers["Access-Control-Allow-Credentials"] = "true"
        response.headers["Access-Control-Allow-Methods"] = "GET,HEAD,OPTIONS,POST,PUT"
        response.headers[
            "Access-Control-Allow-Headers"
        ] = "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
        return response

    with app.app_context():
        db.drop_all()
        db.create_all()
        seed_database()
        return app
