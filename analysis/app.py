# flask applicaiton to execute burn severity analysis (barc_analysis.py)
# uses /run-analysis endpoint with default values for outputs
# optional inputs for s_date, e_date


from flask import Flask, request, jsonify
from flask_cors import CORS
import re
import subprocess
import traceback
from datetime import datetime

# Initialize the Flask application
app = Flask(__name__)
CORS(app, origins=["http://localhost:8080"])

def run_script(command):
    """
    This function runs the analysis script in a separate process.
    This is useful for long-running tasks, as it doesn't block the main Flask thread.
    """
    try:
        # Run the command. `capture_output=True` and `text=True` will capture stdout and stderr.
        # `check=True` will raise a CalledProcessError if the script returns a non-zero exit code.
        process = subprocess.run(command, check=True, capture_output=True, text=True)
        print(f"Script stdout:\n{process.stdout}")
        print(f"Script stderr:\n{process.stderr}")
        print(f"Analysis for {command[2]} {command[3]} completed successfully.")
    except subprocess.CalledProcessError as e:
        # Log any errors that occur during the script execution
        print(f"Error running analysis for {command[2]} {command[3]}.")
        print(f"Return code: {e.returncode}")
        print(f"Output:\n{e.stdout}")
        print(f"Error output:\n{e.stderr}")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")

@app.route('/run-analysis', methods=['POST'])
def run_analysis_endpoint():
    """
    Flask endpoint to trigger the BARC analysis.
    It expects a JSON payload with the necessary parameters.
    """
    # Get the JSON data from the request
    data = request.get_json()

    if not data:
        return jsonify({"error": "Invalid JSON"}), 400

    # Extract parameters from the JSON payload
    fire = data.get('fire') # fire number in the format like N51605 where the fire number allways is a alphabetical character followed by 5 numbers
    year = data.get('year') # fire year ranging from 2020 to current year
    sensor = data.get('sensor') # must be from a list of  ['S2'] may be expanded to include Landsat
    s_date = data.get('s_date') # date in format "2025-08-04"
    e_date = data.get('e_date') # date in format "2025-08-04"
    cloud = data.get('cloud', '10') # number in range 0:100

    # Validate fire format: one letter followed by 5 digits
    if not fire or not re.match(r'^[A-Za-z]\d{5}$', fire):
        return jsonify({"error": "Invalid fire format. Expected format: A12345"}), 400

    # Validate year
    current_year = datetime.now().year
    if not isinstance(year, int) or not (2020 <= year <= current_year):
        return jsonify({"error": f"Invalid year. Must be between 2020 and {current_year}."}), 400

    # Validate sensor
    allowed_sensors = ['S2']  # Expand this list as needed
    if sensor not in allowed_sensors:
        return jsonify({"error": f"Invalid sensor. Allowed values: {allowed_sensors}"}), 400

    # Validate dates
    date_format = "%Y-%m-%d"
    for date_label, date_value in [('s_date', s_date), ('e_date', e_date)]:
        if date_value:
            try:
                datetime.strptime(date_value, date_format)
            except ValueError:
                return jsonify({"error": f"Invalid {date_label}. Expected format: YYYY-MM-DD"}), 400

    # Validate cloud percentage
    try:
        cloud = int(cloud)
        if not (0 <= cloud <= 100):
            raise ValueError
    except ValueError:
        return jsonify({"error": "Cloud must be an integer between 0 and 100."}), 400

    # Construct the command to run the analysis script
    command = [
        'python',
        'barc_analysis.py',
        str(fire),
        str(year),
        str(sensor),
        '-o'
    ]

    # Add optional flags and arguments
    if s_date:
        command.extend(['-s', s_date])
    if e_date:
        command.extend(['-e', e_date])
    if cloud:
        command.extend(['-c', str(cloud)])

    try:
        # Run the script synchronously and wait for it to complete.
        process = subprocess.run(command, check=True, capture_output=True, text=True)
        
        # Return a success response with the script's output
        return jsonify({
            "message": "Analysis completed successfully.",
            "details": {
                "fire": fire,
                "year": year,
                "sensor": sensor
            },
            "stdout": process.stdout,
            "stderr": process.stderr
        }), 200 # 200 OK status code

    except subprocess.CalledProcessError as e:
        # If the script fails, return an error response with the details
        return jsonify({
            "error": "Run analysis failed.",
            "details": {
                "fire": fire,
                "year": year,
                "sensor": sensor,
                "return_code": e.returncode,
                "stdout": e.stdout,
                "stderr": e.stderr
            }
        }), 500 # 500 Internal Server Error
    except Exception as e:
        # Handle other potential errors, such as failing to start the subprocess
        print(traceback.format_exc())  # Log the traceback to stdout (or use logging)
        return jsonify({"error": "An unexpected error occurred."}), 500
@app.route('/health', methods=['GET'])
def health_check():
    """
    Simple health check endpoint.
    Returns 200 OK with a status message.
    """
    return jsonify({"status": "ok"}), 200



if __name__ == '__main__':
    # Run the Flask app
    # The host '0.0.0.0' makes the server accessible from any network interface.
    """ TEST
    curl -X POST http://localhost:5000/run-analysis \
     -H "Content-Type: application/json" \
     -d '{
           "fire": "K51121",
           "year": "2025",
           "sensor": "S2",
           "object_storage": true,
           "cloud": "15",
           "e_date": "2025-08-04"
         }'
    """

    app.run(host='0.0.0.0', port=5000)

