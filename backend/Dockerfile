FROM python:3.10-slim-buster

WORKDIR /app/PriceOptimizer

RUN pip install --upgrade pip

COPY requirements.txt requirements.txt

RUN pip install -r requirements.txt

COPY . .

EXPOSE 8000

CMD python PriceOptimizer/manage.py runserver