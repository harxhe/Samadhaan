import requests
import os

BASE_URL = "http://localhost:8000"
# A sample short audio file URL (public access)
AUDIO_URL = "https://www2.cs.uic.edu/~i101/SoundFiles/BabyElephantWalk60.wav"

def test_transcribe_url():
    print(f"Testing /transcribe with URL: {AUDIO_URL}")
    payload = {"audio_url": AUDIO_URL}
    try:
        response = requests.post(f"{BASE_URL}/transcribe", json=payload)
        if response.status_code == 200:
            print("Success!")
            print(response.json())
        else:
            print(f"Failed: {response.status_code}")
            print(response.text)
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_transcribe_url()
