# backend

Main Feature:
Translate Natural Language to find pokemons MongoDB Query.

Tech use Azure OpenAI.

## Quickstart

1. `poetry install`
2. `poetry shell`
3. copy `.env.example` to `.env`, and config your `AZURE_OPENAI_*` settings.
4. `fastapi dev backend/main.py`

run unit test: `python -m unittest discover -s tests -p 'test_*.py'`

## Reference

1. [Poetry Dockerfile](https://github.com/gianfa/poetry/blob/docs/docker-best-practices/docker-examples/poetry-multistage/Dockerfile)
