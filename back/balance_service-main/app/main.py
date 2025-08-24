from flask import Flask, request, render_template_string, jsonify
import cv2
import numpy as np
from pipeline import detect_plate_from_image
import py_eureka_client.eureka_client as eureka_client
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  #
# Configuration Eureka
EUREKA_SERVER = "http://localhost:8761/eureka/"
APP_NAME = "AIservice"
PORT = 8000



# --- Page HTML pour test manuel ---
@app.route("/detect", methods=["GET"])
def form_page():
    plate = request.args.get("plate", None)
    html_content = """
    <html>
        <body>
            <h2>Upload une image pour détection</h2>
            <form action="/detect" enctype="multipart/form-data" method="post">
                <input name="file" type="file">
                <input type="submit" value="Upload">
            </form>
    """
    if plate:
        html_content += f"<h3>Résultat : {plate}</h3>"

    html_content += "</body></html>"
    return render_template_string(html_content)


# --- Traitement upload ---
@app.route("/detect", methods=["POST"])
def detect():
    file = request.files.get("file")
    if file is None:
        return jsonify({"error": "Aucun fichier reçu"}), 400

    try:
        contents = file.read()
        np_arr = np.frombuffer(contents, np.uint8)
        img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

        plate, _ = detect_plate_from_image(img)  # ta fonction de détection

        # 🔥 Réponse JSON pour le frontend React
        return jsonify({"vehicule": plate})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    # Inscription du service Eureka
    eureka_client.init(
        eureka_server=EUREKA_SERVER,
        app_name=APP_NAME,
        instance_port=PORT
    )
    app.run(host="0.0.0.0", port=PORT, debug=True)
