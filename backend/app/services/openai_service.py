"""
OpenAI service for AI-powered stock analysis and recommendations.
"""

import logging
from typing import Dict, Any
from openai import AsyncOpenAI
from pydantic import ValidationError
from app.config import settings
from app.schemas.recommendation import Factor

logger = logging.getLogger(__name__)

# initialise OpenAI client with API key from settings
_openai_client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)


async def analyze_stock(prompt: str) -> Dict[str, Any]:
    """
    analyse stock data using OpenAI and return structured recommendation.
    """
    try:
        # Define the response schema
        response_format = {
            "type": "json_schema",
            "json_schema": {
                "name": "stock_recommendation",
                "strict": True,
                "schema": {
                    "type": "object",
                    "properties": {
                        "score": {
                            "type": "integer",
                            "minimum": 0,
                            "maximum": 100
                        },
                        "reasoning": {
                            "type": "string"
                        },
                        "factors": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "name": {"type": "string"},
                                    "description": {"type": "string"},
                                    "impact": {"type": "string", "enum": ["positive", "neutral", "negative"]}
                                },
                                "required": ["name", "description", "impact"],
                                "additionalProperties": False
                            },
                            "minItems": 1,
                            "maxItems": 5
                        }
                    },
                    "required": ["score", "reasoning", "factors"],
                    "additionalProperties": False
                }
            }
        }

        system_prompt = """You are a financial analyst AI. analyse the stock data and provide:
- score: integer 0-100 (0-33=sell, 34-66=hold, 67-100=buy)  
- reasoning: 2-3 sentence explanation
- factors: 1-5 key factors with name, description, and impact (positive/neutral/negative)

Base analysis on technical indicators, trends, and volume. Be objective."""

        # wait for response completion
        response = await _openai_client.chat.completions.create(
            model=settings.OPENAI_MODEL,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": prompt}
            ],
            response_format=response_format,
            temperature=0.3,
            max_tokens=settings.OPENAI_MAX_TOKENS
        )
        
        # Parse the JSON content from the response
        import json
        content = response.choices[0].message.content
        result = json.loads(content)
        
        # Validate factors using Pydantic
        validated_factors = []
        for factor in result["factors"]:
            validated_factor = Factor(**factor)
            validated_factors.append(validated_factor.model_dump())
        
        return {
            "score": result["score"],
            "reasoning": result["reasoning"],
            "factors": validated_factors
        }
        
    except Exception as e:
        logger.error(f"OpenAI analysis failed: {str(e)}")
        raise
