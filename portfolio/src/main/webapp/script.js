// Copyright 2020 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * Adds a random quote to the page.
 */
  const quotes =
      ['Yeah Science!', 'SPS is lit', 'I am not throwing away my shot', 'I’m just a simple man trying to make my way in the universe'];

function addRandomQuote() {
  // Pick a random quote.
  const quote = quote[Math.floor(Math.random() * quote.length)];

  // Add it to the page.
  const quoteContainer = document.getElementById('quote-container');
  quoteContainer.innerText = quote;
}

async function showHelloWorld() {
  const responseFromServer = await fetch('/hello');
  const textFromResponse = await responseFromServer.text();
 
  const dateContainer = document.getElementById('hello-container');
  dateContainer.innerText = textFromResponse;
}

