import os

port = os.environ.get("PORT", "8080")
bind = f"0.0.0.0:{port}"
workers = 1
worker_class = "uvicorn.workers.UvicornWorker"
threads = 8
timeout = 120