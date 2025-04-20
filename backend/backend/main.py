import os
from fastapi import FastAPI, Request, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from dotenv import load_dotenv

load_dotenv()

from nl_to_mquery import nl_to_mquery, get_num_tokens

limiter = Limiter(key_func=get_remote_address)
app = FastAPI()
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)


# Set up CORS middleware
origins = [
    "http://localhost",
    "http://localhost:3000",
    os.environ.get("CORS_URL") or "https://xuhaojun.github.io"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/mquery")
@limiter.limit(os.environ.get("MQUERY_LIMIT") or "1/1minute")
async def get_mquery(request: Request, question: str = Query(..., description="Question to translate")):
    num_tokens = get_num_tokens(question)
    if not question or not question.strip():
        raise HTTPException(status_code=400, detail="question is required")
    if num_tokens > 300:
        raise HTTPException(status_code=400, detail="question tokens over limit 300")
    mquery = nl_to_mquery(question)
    if not mquery:
        raise HTTPException(status_code=400, detail="Can not find pokemon")
    return {"questionNumTokens": num_tokens, "mquery": mquery}

@app.get("/health")
async def get_mquery(request: Request):
    return {"status": "ok"}   