from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import traceback
from googletrans import Translator

app = Flask(__name__)
CORS(app)

# Configure Gemini API
genai.configure(api_key="")  # Replace with your actual Gemini API key
model = genai.GenerativeModel("models/gemini-1.5-flash")

# Google Translate
translator = Translator()

@app.route('/chat', methods=['POST'])
def chatbot():
    try:
        data = request.json
        user_message = data.get("message", "").strip()

        if not user_message:
            return jsonify({"error": "Message is required"}), 400

        # Detect and translate input to English
        detected_lang = translator.detect(user_message).lang
        translated_input = translator.translate(user_message, src=detected_lang, dest='en').text

        # Get response from Gemini
        response = model.generate_content(translated_input)
        response_text = response.text.strip()

        # Translate back to original language if needed
        if detected_lang != 'en':
            response_text = translator.translate(response_text, src='en', dest=detected_lang).text

        return jsonify({"response": response_text})

    except Exception as e:
        print("🔥 Error in /chat:")
        traceback.print_exc()
        return jsonify({"error": "Internal server error. Please try again later."}), 500

if __name__ == '__main__':
    app.run(debug=True)
