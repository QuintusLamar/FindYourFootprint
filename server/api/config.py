from os import environ


class Config:
    DEBUG = environ["DEBUG"].lower() == "true" if "DEBUG" in environ else False
    SQLALCHEMY_DATABASE_URI = "sqlite:///site.db"

    # # If the secret key does not need to be initialized
    # SECRET_KEY = environ["SECRET_KEY"]

    # If the secret key needs to be initialized
    SECRET_KEY = "abcdefg"
