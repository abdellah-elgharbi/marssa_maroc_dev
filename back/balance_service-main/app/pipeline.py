from ultralytics import YOLO
import cv2

# charger les modèles une seule fois au démarrage
plate_detector = YOLO('models/best.pt')
ocr_model = YOLO('models/bestchars.pt')

def detect_plate_from_image(img):
    """
    img : image OpenCV (BGR)
    Retourne (matricule, confiance)
    """
    results_plate = plate_detector.predict(img, save=False, conf=0.5)
    if not results_plate or not results_plate[0].boxes:
        return None, 0.0

    # prendre le premier rectangle trouvé
    x1, y1, x2, y2 = map(int, results_plate[0].boxes.xyxy[0])
    plate_crop = img[y1:y2, x1:x2]

    # détecter les caractères
    results_chars = ocr_model.predict(plate_crop, save=False, conf=0.5)
    boxes = results_chars[0].boxes

    detected = []
    for i in range(len(boxes)):
        xmin = boxes.xyxy[i][0].item()
        cls_id = int(boxes.cls[i])
        detected.append((xmin, cls_id))

    detected.sort(key=lambda x: x[0])

    names = ['0', '1', '10', '11', '12', '13', '14', '15', '16', '17', '2', '3', '4', '5', '6', '7', '8', '9']
    converted = [names[cls] for _, cls in detected]

    mapping = {
        '0': '0', '1': '1', '2': 'A', '3': 'B', '4': 'E', '5': 'D',
        '6': 'H', '7': 'T', '8': 'Y', '9': '2', '10': '3', '11': '4',
        '12': '5', '13': '6', '14': '7', '15': '8', '16': '9', '17': 'W'
    }
    decoded_plate = [mapping[val] for val in converted]
    matricule = "".join(decoded_plate)

    return matricule, 0.95
