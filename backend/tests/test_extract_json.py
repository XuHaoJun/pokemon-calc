import unittest
import json
import re

from backend.nl_to_mquery import extract_json

class TestExtractJson(unittest.TestCase):

    def test_json_block_extraction(self):
        response = '```json\n{"key": "value"}\n```'
        expected_result = {"key": "value"}
        self.assertEqual(extract_json(response), expected_result)

    def test_json_object_extraction(self):
        response = 'This is some text with a JSON object in it: { "key": "value" }'
        expected_result = {"key": "value"}
        self.assertEqual(extract_json(response), expected_result)

    def test_no_json_found(self):
        response = 'This is some text with no JSON in it.'
        self.assertIsNone(extract_json(response))

    def test_invalid_json(self):
        response = '```json\n{"key": "value" invalid json}\n```'
        self.assertIsNone(extract_json(response))

    def test_empty_response(self):
        response = ''
        self.assertIsNone(extract_json(response))

    def test_response_with_only_triple_backticks(self):
        response = '```json```'
        self.assertIsNone(extract_json(response))

    def test_response_with_only_curly_brackets(self):
        response = '{}'
        expected_result = {}
        result = extract_json(response)
        self.assertEqual(result, expected_result)

    def test_extract_json_with_openai_response_1(self):
        response = '{"$and": [{"key": "value"}, {"key2": "value2"}]}'
        expected_result = {"$and": [{"key": "value"}, {"key2": "value2"}]}
        result = extract_json(response)
        self.assertEqual(result, expected_result)

if __name__ == '__main__':
    unittest.main()   