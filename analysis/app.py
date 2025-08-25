# flask applicaiton to execute burn severity analysis (barc_analysis.py)
# uses /run-analysis endpoint with default values for outputs
# optional inputs for s_date, e_date


from flask import Flask, request, jsonify
import subprocess

# Initialize the Flask application
app = Flask(__name__)

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
    fire = data.get('fire')
    year = data.get('year')
    sensor = data.get('sensor')
    s_date = data.get('s_date')
    e_date = data.get('e_date')
    cloud = data.get('cloud', '10')

    # Validate required parameters
    if not all([fire, year, sensor]):
        return jsonify({"error": "Missing required parameters: fire, year, and sensor are required."}), 400

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
        return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500
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

