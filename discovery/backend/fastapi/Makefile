
run:
	PYTHONPATH=code uvicorn app.main:app --reload --port 8001

install:
	pip install -r requirements.txt
	pip install prisma httpx

lint:
	ruff code/app

format:
	ruff format code/app

prisma-init:
	cd code/app && prisma init

generate:
	cd code/app && prisma generate

prisma-push:
	cd code/app && prisma db push

prisma-studio:
	cd code/app && prisma studio
