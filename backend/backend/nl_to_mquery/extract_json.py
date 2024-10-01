import json
import re

def extract_json(response) -> dict | None:
    """
    Extract JSON from a GPT-4O response.

    Args:
        response (str): The GPT-4O response text.

    Returns:
        dict or None: The extracted JSON data, or None if no JSON was found.
    """
    # Look for a JSON block ( triple backticks )
    json_block_match = re.search(r'```json(.*?)```', response, re.DOTALL)
    if json_block_match:
        json_text = json_block_match.group(1).strip()
        try:
            return json.loads(json_text)
        except json.JSONDecodeError:
            pass

    # Look for a JSON object that is not enclosed in triple backticks
    json_object_match = re.search(r'\{.*\}', response, re.DOTALL)
    if json_object_match:
        json_text = json_object_match.group(0)
        try:
            return json.loads(json_text)
        except json.JSONDecodeError:
            pass

    return None