from flask import Flask, jsonify
from serial_reader import SerialReader
import py_eureka_client.eureka_client as eureka_client
import socket

SERVICE_NAME = "PESAGESERVICE"
SERVICE_PORT = 5000
EUREKA_SERVER = "http://localhost:8761/eureka"

app = Flask(__name__)

reader = SerialReader(port="COM3", baudrate=9600)
reader.start()

# Enregistrement Eureka
eureka_client.init(
    eureka_server=EUREKA_SERVER,
    app_name=SERVICE_NAME,
    instance_port=SERVICE_PORT,
    instance_host=socket.gethostbyname(socket.gethostname()),
    health_check_url=f"http://localhost:{SERVICE_PORT}/health",
    status_page_url=f"http://localhost:{SERVICE_PORT}/",
    renewal_interval_in_secs=10,
    duration_in_secs=30
)

@app.route("/poids", methods=["GET"])
def get_poids():
    if reader.dernier_poids is not None:
        return jsonify({"poids": reader.dernier_poids})
    else:
        return jsonify({"poids": None, "message": "Pas encore de données"}), 503

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "UP"})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=SERVICE_PORT)
