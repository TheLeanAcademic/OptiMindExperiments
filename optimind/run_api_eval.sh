#!/bin/bash

# OptiMind Evaluation Script for API-based LLMs (GPT, Claude, etc.)
# This script runs evaluations on small problem sets using API-based models
# without requiring GPU resources.

set -e  # Exit on error

echo "=========================================="
echo "OptiMind API-based Evaluation"
echo "=========================================="

# Configuration
DATA_SMALL="data/small_test.csv"
MAX_TURNS=2
NUM_MAJORITY=1
SEED=1

# Backend configuration (choose one)
# Option 1: OpenAI GPT-4
BACKEND="openai"
API_KEY_NAME="OPENAI_API_KEY"
BASE_URL="https://api.openai.com/v1"
MODEL_NAME="gpt-4"

# Option 2: OpenAI GPT-3.5 (cheaper)
# MODEL_NAME="gpt-3.5-turbo"

# Option 3: Claude via OpenRouter
# API_KEY_NAME="OPENROUTER_API_KEY"
# BASE_URL="https://openrouter.ai/api/v1"
# MODEL_NAME="anthropic/claude-3.5-sonnet"

# Option 4: GPT-4 via OpenRouter
# API_KEY_NAME="OPENROUTER_API_KEY"
# BASE_URL="https://openrouter.ai/api/v1"
# MODEL_NAME="openai/gpt-4"

# Check if API key is set
if [ -z "${!API_KEY_NAME}" ]; then
    echo "Error: ${API_KEY_NAME} environment variable is not set"
    echo "Please set it with: export ${API_KEY_NAME}=your-api-key"
    exit 1
fi

# Check if data file exists
if [ ! -f "$DATA_SMALL" ]; then
    echo "Warning: $DATA_SMALL not found"
    echo "Creating small test dataset..."
    python3 filter_small_problems.py \
        --input "data/optimind_cleaned_classified_industryor.csv" \
        --output "$DATA_SMALL" \
        --num 5
fi

echo ""
echo "Configuration:"
echo "  Backend: $BACKEND"
echo "  Model: $MODEL_NAME"
echo "  Data: $DATA_SMALL"
echo "  Max turns: $MAX_TURNS"
echo "  Seed: $SEED"
echo ""

# Run evaluation
python3 eval.py \
    --data "$DATA_SMALL" \
    --backend_str "$BACKEND" \
    --openai_base_url "$BASE_URL" \
    --openai_model_name "$MODEL_NAME" \
    --openapi_api_key_name "$API_KEY_NAME" \
    --max-turns "$MAX_TURNS" \
    --num-majority "$NUM_MAJORITY" \
    --temp 0.6 \
    --top-p 0.95 \
    --seed "$SEED" \
    --debug
echo ""
echo "=========================================="
echo "Evaluation complete!"
echo "Results saved in: eval_results/"
echo "=========================================="