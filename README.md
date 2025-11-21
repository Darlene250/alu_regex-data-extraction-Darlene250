# Regex Data Extraction Project

## Project Overview

This project extracts and categorizes specific data types from strings using regular expressions. It identifies 7 common patterns, such as:

- HTML tags
- Currency amounts
- Credit card numbers
- Phone numbers
- URLs
- Email addresses
- Time (12-hour & 24-hour formats)

The script applies regex patterns to each category and outputs matches in the console for easy verification.

---

## Key Features

- Regex-based Extraction: Efficiently identifies multiple data types.  
- Categorized Matching: Each type of data is processed separately.  
- Dynamic Handling: Supports variations like different phone number formats, email domains, and credit card formats.  
- Console Output: Matched results displayed clearly for verification.

---

## Use Cases

- Data Validation: Check emails, URLs, phone numbers, and credit cards.  
- Text Parsing: Extract relevant data for processing or reporting.  
- Web Scraping: Identify and extract HTML tags and URLs from web pages.

---

## Run the Script to test using:
   node script.js

## Example Output
 The matched data types for Email addresses are:
user@example.com → user@example.com
firstname.lastname@company.co.uk → firstname.lastname@company.co.uk
