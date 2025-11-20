"""
OpenAI service for AI-powered stock analysis and recommendations.

This module provides integration with OpenAI's API to generate intelligent
stock recommendations based on market data and technical indicators.
"""

import json
import logging
from typing import Dict, Any
from openai import AsyncOpenAI
from app.config import settings

logger = logging.getLogger(__name__)

# Initialize OpenAI client with API key from settings
_openai_client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)


async def analyze_stock(prompt: str) -> Dict[str, Any]:
    """
    Analyze stock data using OpenAI's GPT model and return recommendation.
    Sends stock market data to the API and receives an AI-generated score,
    reasoning, and contributing factors (data returned in JSON format).
    """
    try:
        # System prompt defines the AI's role and response format
        system_prompt = """You are a financial analyst AI that provides stock recommendations based on technical analysis. 
Analyze the provided stock data and technical indicators to generate a recommendation score 
between 0 and 100, where:
- 0-33: Sell recommendation
- 34-66: Hold recommendation  
- 67-100: Buy recommendation

Provide your analysis in the following JSON format:
{
  "score": <number 0-100>,
  "reasoning": "<2-3 sentence explanation>",
  "factors": [
    {
      "name": "<factor name>",
      "description": "<brief explanation>",
      "impact": "<positive|neutral|negative>"
    }
  ]
}

Base your analysis on technical indicators, price trends, and volume patterns. 
Be objective and data-driven. Do not provide financial advice."""

        # Call OpenAI API with configured parameters from settings
        # temperature=0.7 for balanced responses
        # max_tokens from config (default 1000) for structured response
        response = await _openai_client.chat.completions.create(
            model=settings.OPENAI_MODEL,  # Model from config (default: gpt-4-turbo)
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,  # Balanced creativity and consistency
            max_tokens=settings.OPENAI_MAX_TOKENS,  # Max tokens from config
            response_format={"type": "json_object"}  # Ensure JSON response
        )
        
        # Extract the response content from the API response
        content = response.choices[0].message.content
        
        # Parse the JSON response from OpenAI
        # The AI is instructed to return structured JSON with score, reasoning, and factors
        try:
            result = json.loads(content)
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse OpenAI response as JSON: {content}")
            raise ValueError(f"Invalid JSON response from OpenAI: {str(e)}")
        
        # Validate that required fields are present
        if "score" not in result or "reasoning" not in result or "factors" not in result:
            logger.error(f"OpenAI response missing required fields: {result}")
            raise ValueError("OpenAI response missing required fields (score, reasoning, or factors)")
        
        logger.info(f"Successfully analyzed stock with score: {result['score']}")
        return result
        
    except Exception as e:
        logger.error(f"OpenAI API error: {str(e)}")
        raise
