#!/usr/bin/node

// Sample Object strings for each data type
let str = {
    "HTML tags" : ["<p>", '<div class="example">', '<img src="image.jpg" alt="description">'],
    "Email addresses" : ["user@example.com", "fisrtname.lastname@company.co.uk"],
    "Credit card numbers" : ["1234 5678 9012 3456", "1234-5678-9012-3456"],
    "URLs" : ["https://www.example.com", "https://subdomain.example.org/page"],
    "Phone Numbers" : ["(123) 456-7890", "123-456-7890", "123.456.7890"],
    "Time" : ["14:30", "2:30 PM", "9:15 AM", "23:59", "12:00 PM"],
    "Currency amounts" : ["$19.99", "$1,234.56", "$0.99", "$100"]

};
//The regular expression patterns for fetching
let EmailRegex = /[a-zA-Z0-9.]+@[a-zA-Z]+\.com?(\.uk)?/g
let linkRegex = /https?:\/\/[a-zA-Z]+\.example\.[a-zA-Z]+(\/[a-zA-Z]+)?/g
let Phonenumber = /\(?\d{3,}\)?(\s|\.|-)\d{3,}(-|.)\d{4,}/g
let CreditCard = /\d{4,}(\s|-)\d{4,}(\s|-)\d{4,}(\s|-)\d{4,}/g
let HtmltagsRegex = /<[^>]+>/g

// Loop through each key in the object and apply the corresponding regex and print the matches
for (let key in str) {
    console.log(`\nThe matched data types for ${key} are:`);

    str[key].forEach(item => {
        let matched;

        ;
         if (key === "HTML tags") {
            matched = item.match(HtmltagsRegex);
        } else if (key === "Currency amounts") {
            matched = item.match(CurrencyRegex);
        } else if (key === "Email addresses") {
            matched = item.match(EmailRegex)
        } else if (key === "Credit card numbers") {
            matched = item.match(CreditCard);
        } else if (key === "Phone Numbers") {
            matched = item.match(Phonenumber);
        } else if (key === "URLs") {
            matched = item.match(linkRegex);
        } else if (key === "Time") {
            matched = item.match(TimeRegex);

            }
            console.log(`${item} → ${matched}`);
    });
}