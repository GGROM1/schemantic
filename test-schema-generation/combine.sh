#!/bin/bash

# TypeScript File Combiner Script
# Combines modular TypeScript files into a single consolidated file
# Usage: ./combine-ts.sh <target_directory>

set -euo pipefail

# Configuration
TARGET_DIR="${1:-.}"
OUTPUT_FILE="combined.ts"
TEMP_FILE="${OUTPUT_FILE}.tmp"

# Define the expected file structure with priority ordering
declare -a FILE_STRUCTURE=(
    "api-client.ts"
    "barrel.ts"
    "hooks.ts"
    "index.ts"
    "types.ts"
)

# Utility functions
log_info() { echo "[INFO] $*" >&2; }
log_warn() { echo "[WARN] $*" >&2; }
log_error() { echo "[ERROR] $*" >&2; exit 1; }

# Validate target directory
validate_directory() {
    [[ -d "$TARGET_DIR" ]] || log_error "Directory '$TARGET_DIR' does not exist"
    cd "$TARGET_DIR" || log_error "Cannot access directory '$TARGET_DIR'"
    log_info "Processing directory: $(pwd)"
}

# Generate file header with metadata
generate_header() {
    {
        echo "// Combined TypeScript Module"
        echo "// Generated: $(date -Iseconds)"
        echo "// Source Directory: $(pwd)"
        echo "// Architecture: Modular API client with hooks and type definitions"
        echo
    } > "$TEMP_FILE"
}

# Process files strictly in defined order
combine_files() {
    local processed_count=0
    generate_header

    for file in "${FILE_STRUCTURE[@]}"; do
        if [[ -f "$file" ]]; then
            log_info "Appending $file"
            cat "$file" >> "$TEMP_FILE"
            echo -e "\n" >> "$TEMP_FILE"
            ((processed_count++))
        else
            log_warn "Missing expected file: $file"
        fi
    done

    if [[ $processed_count -eq 0 ]]; then
        log_error "No TypeScript files were combined – none of the expected files were found."
    fi

    # Atomically replace the output file
    mv "$TEMP_FILE" "$OUTPUT_FILE"
    log_info "Successfully combined $processed_count files into $OUTPUT_FILE"
}


# Cleanup function
cleanup() {
    [[ -f "$TEMP_FILE" ]] && rm -f "$TEMP_FILE"
}

# Main execution
main() {
    trap cleanup EXIT
    validate_directory
    combine_files
    log_info "File combination complete. Output: $(pwd)/$OUTPUT_FILE"
    log_info "Combined file size: $(wc -l < "$OUTPUT_FILE") lines"
}

main "$@"
