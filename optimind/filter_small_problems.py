#!/usr/bin/env python3
"""
Filter datasets to small problems suitable for free Gurobi license.
The free license has limits on problem size (variables/constraints).
"""

import pandas as pd
import argparse
import os

def filter_dataset(input_path, output_path, n_problems=10):
    """
    Filter dataset to first N problems for testing with free Gurobi license.
    
    Args:
        input_path: Path to input CSV file
        output_path: Path to output CSV file
        n_problems: Number of problems to include (default: 10)
    """
    print(f"Reading dataset from: {input_path}")
    df = pd.read_csv(input_path)
    
    print(f"Original dataset size: {len(df)} problems")
    
    # Filter to first N problems
    df_small = df.head(n_problems)
    
    # Save filtered dataset
    df_small.to_csv(output_path, index=False)
    
    print(f"Filtered dataset saved to: {output_path}")
    print(f"New dataset size: {len(df_small)} problems")
    print("\nColumn names:", df_small.columns.tolist())
    print("\nFirst problem preview:")
    if 'question' in df_small.columns:
        print(df_small['question'].iloc[0][:200] + "...")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Filter optimization datasets to small problems")
    parser.add_argument("--input", type=str, required=True, help="Input CSV file path")
    parser.add_argument("--output", type=str, required=True, help="Output CSV file path")
    parser.add_argument("--n", type=int, default=10, help="Number of problems to include (default: 10)")
    
    args = parser.parse_args()
    
    # Check if input file exists
    if not os.path.exists(args.input):
        print(f"Error: Input file not found: {args.input}")
        print("\nAvailable datasets in data/ directory:")
        if os.path.exists("data"):
            for f in os.listdir("data"):
                if f.endswith(".csv"):
                    print(f"  - data/{{f}}")
        exit(1)
    
    filter_dataset(args.input, args.output, args.n)