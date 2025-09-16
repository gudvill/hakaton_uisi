# Модели базы данных

from sqlalchemy import Column, Integer, String, Text, Date, ForeignKey, Boolean
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Cases(Base):
    __tablename__ = "cases"

    id = Column(Integer, primary_key=True)
    name = Column(String(50))
    case_number = Column(Integer)
    image = Column(String(100))
    level = Column(String(50))
    description = Column(Text)
    partner = Column(String(50))


class News(Base):
    __tablename__ = "news"

    id = Column(Integer, primary_key=True)
    name = Column(String(50))
    image = Column(String(100))
    created_at = Column(Date)
    brief_description = Column(Text)
    full_description = Column(Text)


class Reviews(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True)
    name = Column(String(50))
    content = Column(Text)
    image = Column(String(100))


class Partners(Base):
    __tablename__ = "partners"

    id = Column(Integer, primary_key=True)
    name = Column(String(50))
    image = Column(String(100))
    description = Column(Text)


class Registration(Base):
    __tablename__ = "registration"

    id = Column(Integer, primary_key=True)
    name = Column(String(50), nullable=True)
    institution = Column(String(100), nullable=True)
    amount_participants = Column(Integer, nullable=True)
    participation_form = Column(String(50), nullable=True)
	#participants = ???
    selected_case = Column(Integer, nullable=True)
    captain_phone = Column(String(50), nullable=True)
    captain_email = Column(String(50), nullable=True)
	#team_curator = ???
    agreement = Column(Boolean, nullable=True)
    acquaintance = Column(Boolean, nullable=True)


class PhotoAlbum(Base):
    __tablename__ = "photo_album"

    id = Column(Integer, primary_key=True)
    image = Column(Text)
    created_at = Column(Date)