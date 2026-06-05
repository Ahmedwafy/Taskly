/*
  Regular Expression .. 135

  Syntax
  /pattern/modifier(s);
  new RegExp("pattern", "modifier(s)")

  Modifiers => Flags
  i => case-insensitive
  g => global
  m => Multilines

  Search Methods
  - match(Pattern)

  Match
  -- Matches A String Against a Regular Expression Pattern
  -- Returns An Array With The Matches
  -- Returns null If No Match Is Found.
*/

let myString = 'Hello Elzero Web School I Love elzero';
let regex = /elzero/gi;
console.log(myString.match(regex));
// //////////////////////////////////////////////////////////////////////////////
/*
  Regular Expression .. 136

  Ranges

  - Part 1
  (X|Y) => X Or Y
  [0-9] => 0 To 9
  [^0-9] => Any Character Not 0 To 9
  Practice

  - Part 2
  [a-z]
  [^a-z]
  [A-Z]
  [^A-Z]
  [abc]
  [^abc]

*/

let tld = 'Com Net Org Info Code Io';
let tldRe = /(info|org|io)/gi;
console.log(tld.match(tldRe));

let nums = '12345678910';
let numsRe = /[0-2]/g;
console.log(nums.match(numsRe));

let notNums = '12345678910';
let notNsRe = /[^0-2]/g;
console.log(notNums.match(notNsRe));

let specialNums = '1!2@3#4$5%678910';
let specialNumsRe = /[^0-9]/g;
console.log(specialNums.match(specialNumsRe));

let practice = 'Os1 Os1Os Os2 Os8 Os8Os';
let practiceRe = /Os[5-9]Os/g;
console.log(practice.match(practiceRe));
// //////////////////////////////////////////////////////////////////////////////

/*
  Regular Expression .. 137

  Ranges

  - Part 1
  (X|Y) => X Or Y
  [0-9] => 0 To 9
  [^0-9] => Any Character Not 0 To 9
  Practice

  - Part 2
  [a-z]
  [^a-z]
  [A-Z]
  [^A-Z]
  [abc]
  [^abc]

*/

let myString = 'AaBbcdefG123!234%^&*';
let atozSmall = /[a-z]/g;
let NotAtozSmall = /[^a-z]/g;
let atozCapital = /[A-Z]/g;
let NotAtozCapital = /[^A-Z]/g;
let aAndcAnde = /[ace]/g;
let NotaAndcAnde = /[^ace]/g;
let lettersCapsAndSmall = /[a-zA-Z]/g;
let numsAndSpecials = /[^a-zA-Z]/g;
let specials = /[^a-zA-Z0-9]/g;
console.log(myString.match(atozSmall));
console.log(myString.match(NotAtozSmall));
console.log(myString.match(atozCapital));
console.log(myString.match(NotAtozCapital));
console.log(myString.match(aAndcAnde));
console.log(myString.match(NotaAndcAnde));
console.log(myString.match(lettersCapsAndSmall));
console.log(myString.match(numsAndSpecials));
console.log(myString.match(specials));
// //////////////////////////////////////////////////////////////////////////////
/*
  Regular Expression .. 138
  Character Classes
  . => matches any character, except newline or other line terminators.
  \w => matches word characters. [a-z, A-Z, 0-9 And Underscore]
  \W => matches Non word characters
  \d => matches digits from 0 to 9.
  \D => matches non-digit characters.
  \s => matches whitespace character.
  \S => matches non whitespace character.
*/

let email = 'O@@@g...com O@g.com O@g.net A@Y.com O-g.com o@s.org 1@1.com';
let dot = /./g;
let word = /\w/g;
let valid = /\w@\w.(com|net)/g;
console.log(email.match(dot));
console.log(email.match(word));
console.log(email.match(valid));
// //////////////////////////////////////////////////////////////////////////////
/*
  Regular Expression .. 139
  Character Classes
  \b => matches at the beginning or end of a word.
  \B => matches NOT at the beginning/end of a word.

  Test Method
  pattern.test(input)
*/

let names = 'Sayed 1Spam 2Spam 3Spam Spam4 Spam5 Osama Ahmed Aspamo';
let re = /(\bspam|spam\b)/gi;
console.log(names.match(re));

console.log(re.test(names));
console.log(/(\bspam|spam\b)/gi.test('Osama'));
console.log(/(\bspam|spam\b)/gi.test('1Spam'));
console.log(/(\bspam|spam\b)/gi.test('Spam1'));
// //////////////////////////////////////////////////////////////////////////////
/*
  Regular Expression .. 140

  Quantifiers
  n+    => One Or More
  n*    => zero or more
  n?    => zero or one
*/

let mails = 'o@nn.sa osama@gmail.com elzero@gmail.net osama@mail.ru'; // All Emails
// let mailsRe = /\w+@\w+.(com|net)/ig;
let mailsRe = /\w+@\w+.\w+/gi;
console.log(mails.match(mailsRe));

let nums = '0110 10 150 05120 0560 350 00'; // 0 Numbers Or No 0
let numsRe = /0\d*0/gi;
console.log(nums.match(numsRe));

let urls = 'https://google.com http://www.website.net web.com'; // http + https
let urlsRe = /(https?:\/\/)?(www.)?\w+.\w+/gi;
console.log(urls.match(urlsRe));
// //////////////////////////////////////////////////////////////////////////////
