const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'script.js');
let content = fs.readFileSync(filePath, 'utf8');

// The new steps array
const newSteps = "['Product', 'Device', 'Material', 'Theme', 'Uploads', 'Customize', 'AI Studio', 'Preview', 'Checkout']";

// Use a regex replacer function to adjust `current={...}`
// The regex finds `<StepIndicator ... current={X} />`
const regex = /<StepIndicator\s+steps=\{.*?\}\s+current=\{(.*?)\}\s*\/>/g;

content = content.replace(regex, (match, currentStr) => {
    let current = parseInt(currentStr, 10);
    
    // If it's a simple integer
    if (!isNaN(current)) {
        // Since we added step 4 (Uploads), anything that was >= 4 gets +1.
        // Wait, wait... Let's map it based on component manually if it's complex,
        // but if it's a simple number we can just check if it's >= 4.
        if (current >= 4) {
            current += 1;
        }
        return `<StepIndicator steps={${newSteps}} current={${current}} />`;
    }
    
    // If it's complex like `product === 'phone' ? 4 : 3`
    if (currentStr.includes('?')) {
         // It's easier to just do it manually or replace the complex logic
         // with just the simple array if we unify the wizard.
         // Let's just unify the wizard to ALWAYS show all 9 steps!
         // Wait, the complex logic was `product === 'phone' && mode === 'pro' ? 4 : 3`.
         // Let's just blindly add 1 to the numbers in the ternary if they are >= 4.
         let newCurrentStr = currentStr.replace(/\d+/g, (num) => {
             let n = parseInt(num, 10);
             return n >= 4 ? n + 1 : n;
         });
         return `<StepIndicator steps={${newSteps}} current={${newCurrentStr}} />`;
    }
    
    return match;
});

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated StepIndicators!');
