import pandas as pd
import argparse

def filter_small_problems(input_file, output_file, num_problems=10):
    """
    Filter dataset to include only a small number of problems.
    This is useful for testing with free Gurobi license and API-based LLMs.
    """
    print(f"Reading dataset from {input_file}...")
    df = pd.read_csv(input_file)
    
    print(f"Total problems in dataset: {len(df)}")
    
    # Filter to first N problems
    df_small = df.head(num_problems)
    
    # Save filtered dataset
    df_small.to_csv(output_file, index=False)
    
    print(f"✓ Created filtered dataset with {len(df_small)} problems")
    print(f"✓ Saved to: {output_file}")
    
    return len(df_small)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Filter dataset to small number of problems")
    parser.add_argument("--input", type=str, required=True, help="Input CSV file path")
    parser.add_argument("--output", type=str, required=True, help="Output CSV file path")
    parser.add_argument("--num", type=int, default=10, help="Number of problems to keep (default: 10)")
    
    args = parser.parse_args()
    
    filter_small_problems(args.input, args.output, args.num)