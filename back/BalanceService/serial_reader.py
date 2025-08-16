import serial
import re
import time
import threading
import random

class SerialReader(threading.Thread):
    def __init__(self, port="COM3", baudrate=9600):
        super().__init__()
        self.port = port
        self.baudrate = baudrate
        self.dernier_poids = None
        self.running = True

    def run(self):
        try:
            # Tentative de connexion au port série
            with serial.Serial(
                port=self.port,
                baudrate=self.baudrate,
                bytesize=serial.EIGHTBITS,
                parity=serial.PARITY_NONE,
                stopbits=serial.STOPBITS_ONE,
                timeout=2
            ) as ser:
                print(f"Lecture en cours sur {self.port}...")

                while self.running:
                    raw_data = ser.readline()
                    
                    if raw_data:
                        try:
                            decoded_data = raw_data.decode('utf-8').strip()
                        except UnicodeDecodeError:
                            decoded_data = raw_data.decode('ascii', errors='ignore').strip()
                        
                        match = re.search(r"(\d+\.?\d*)", decoded_data)
                        if match:
                            self.dernier_poids = float(match.group(1))
                        else:
                            print("Aucun nombre détecté, génération aléatoire")
                            self.dernier_poids = round(random.uniform(50, 100), 2)
                    else:
                        # Timeout → générer une valeur aléatoire
                        print("Pas de signal reçu, génération aléatoire")
                        self.dernier_poids = round(random.uniform(50, 100), 2)
                    
                    time.sleep(0.5)

        except serial.SerialException:
            print(f"Port série {self.port} non disponible, génération aléatoire continue...")
            while self.running:
                self.dernier_poids = round(random.uniform(50, 100), 2)
                time.sleep(1)
        except Exception as e:
            print(f"Erreur inattendue: {e}")

    def stop(self):
        self.running = False
