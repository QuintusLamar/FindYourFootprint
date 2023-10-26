from datetime import datetime
from api import db, bcrypt


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)

    def verify_password(self, password):
        return bcrypt.check_password_hash(self.password, password)
