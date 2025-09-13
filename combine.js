#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Configuration
const TEST_SCHEMA_GENERATION_DIR = 'test-schema-generation';
const OUTPUT_FILE = 'combined.ts';

// Define the expected file structure with priority ordering
const FILE_STRUCTURE = [
    'api-client.ts',
    'barrel.ts', 
    'hooks.ts',
    'index.ts',
    'types.ts'
];

// Utility functions
function logInfo(message) {
    console.log(`[INFO] ${message}`);
}

function logWarn(message) {
    console.warn(`[WARN] ${message}`);
}

function logError(message) {
    console.error(`[ERROR] ${message}`);
    process.exit(1);
}

// Generate file header with metadata
function generateHeader(dirName) {
    const timestamp = new Date().toISOString();
    return [
        `// Combined TypeScript Module`,
        `// Generated: ${timestamp}`,
        `// Source Directory: ${dirName}`,
        `// Architecture: Modular API client with hooks and type definitions`,
        ''
    ].join('\n');
}

// Process files strictly in defined order
function combineFiles(targetDir) {
    const dirName = path.basename(targetDir);
    const outputPath = path.join(targetDir, OUTPUT_FILE);
    let content = generateHeader(dirName);
    let processedCount = 0;

    for (const file of FILE_STRUCTURE) {
        const filePath = path.join(targetDir, file);
        if (fs.existsSync(filePath)) {
            logInfo(`Appending ${file} from ${dirName}`);
            const fileContent = fs.readFileSync(filePath, 'utf8');
            
            // Add comment separator for the file
            content += `// ${file.replace('.ts', '')}\n`;
            content += fileContent;
            content += '\n\n';
            processedCount++;
        } else {
            logWarn(`Missing expected file: ${file} in ${dirName}`);
        }
    }

    if (processedCount === 0) {
        logWarn(`No TypeScript files were combined in ${dirName} – none of the expected files were found.`);
        return;
    }

    // Write the combined file
    fs.writeFileSync(outputPath, content, 'utf8');
    logInfo(`Successfully combined ${processedCount} files into ${outputPath}`);
}

// Main execution
function main() {
    const testSchemaDir = path.resolve(TEST_SCHEMA_GENERATION_DIR);
    
    if (!fs.existsSync(testSchemaDir)) {
        logError(`Directory '${testSchemaDir}' does not exist`);
    }

    logInfo(`Processing directory: ${testSchemaDir}`);

    // Get all subdirectories
    const entries = fs.readdirSync(testSchemaDir, { withFileTypes: true });
    const directories = entries
        .filter(entry => entry.isDirectory())
        .map(entry => entry.name);

    if (directories.length === 0) {
        logWarn('No subdirectories found in test-schema-generation');
        return;
    }

    logInfo(`Found ${directories.length} directories to process: ${directories.join(', ')}`);

    // Process each directory
    for (const dir of directories) {
        const dirPath = path.join(testSchemaDir, dir);
        logInfo(`\nProcessing directory: ${dir}`);
        combineFiles(dirPath);
    }

    logInfo('\nFile combination complete for all directories');
}

// Run the script
if (require.main === module) {
    main();
}

module.exports = { combineFiles, generateHeader };

