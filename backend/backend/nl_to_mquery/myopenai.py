import os
import argparse
from openai import AzureOpenAI
import tiktoken
from .extract_json import extract_json

client = AzureOpenAI(
  azure_endpoint = os.getenv("AZURE_OPENAI_ENDPOINT"),
  api_key=os.getenv("AZURE_OPENAI_API_KEY"),
  api_version="2024-02-01"
)

pokedex_json = None

def get_pokedex_json() -> str:
  global pokedex_json
  if pokedex_json:
    return pokedex_json
  current_code_path = os.path.dirname(__file__)
  data_path = os.path.join(current_code_path, 'pokedex.json')
  with open(data_path, 'r', encoding='utf-8') as file:
    pokedex_json = file.read()
  return pokedex_json

def create_prompt(question: str) -> str:
  parts = []
  parts.append('Mongodb Pokemon Collection Sample Data:')
  # parts.append("here's the data linke: https://raw.githubusercontent.com/XuHaoJun/openai-playground/refs/heads/main/data/pokedex.json")
  parts.append('```json')
  parts.append(get_pokedex_json())
  parts.append('```')
  parts.append('Columns name has suffix "*Display"(ex: nameDisplay) is alerdy i18n translated, so it is not need to translate, following is a question to Mongodb Query example:')
  parts.append('Question:招式劍舞, Translated: {"moves": {"$elemMatch": {"nameDisplay": "劍舞"}}}.')
  parts.append('Question:招式噴射火焰, Translated: {"moves": {"$elemMatch": {"nameDisplay": "噴射火焰"}}}.')
  parts.append('Tips:')
  parts.append('1. Every Question should suppose it is try find pokemons.')
  parts.append('2. If you confirm it is not find pokemon question or it is can not one mongodb query found it, then response should include "Can not find pokemon" in start.')
  parts.append('3. Translated Mongodb Query, do not include db.*.find, just json, and do not include any description or explaintion.')
  parts.append('4. Should not duplicate key, put conditions to "$and" query')
  parts.append('5. Column "typesV2" is same thing to pokemon "types"')
  parts.append('Translate this question into Mongodb Query:')
  parts.append(question)
  return '\n'.join(parts)

def call_llm(prompt: str) -> str:
    """
    Call the LLM with the given prompt and return the response.

    :param prompt: The prompt to use when calling the LLM.
    :return: The response from the LLM.
    """
    messages = [
        {'content': prompt, 'role': 'user'}
    ]
    reply = client.chat.completions.create(model='gpt-4o', messages=messages)
    return reply.choices[0].message.content

def get_num_tokens(text: str) -> int:
  """Return the number of tokens in a string."""
  return len(tiktoken.encoding_for_model('gpt-4o').encode(text))

def nl_to_mquery(question: str) -> dict | None:
  prompt = create_prompt(question)
  answer = call_llm(prompt)
  return extract_json(answer)


if __name__ == '__main__':
  parser = argparse.ArgumentParser()
  parser.add_argument('question', type=str, help='Question to translate')
  args = parser.parse_args()
  prompt = create_prompt(args.question)
  print('prompt tokens:', get_num_tokens(prompt))
  answer = call_llm(prompt)
  print(answer)